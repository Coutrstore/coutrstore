import { supabase } from "@/integrations/supabase/client";

/* ---------- Types (kept in a Shopify-like shape for component compatibility) ---------- */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface CatalogVariant {
  id: string;
  title: string;
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface CatalogProduct {
  node: {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    vendor: string;
    gender: string;
    category: string;
    priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: CatalogVariant }> };
    options: Array<{ name: string; values: string[] }>;
    collections: string[];
  };
}

export interface CollectionRecord {
  handle: string;
  title: string;
  kind: string;
  parent: string | null;
  image_url: string | null;
  description: string;
  sort_order: number;
  featured: boolean;
}

interface DbVariant {
  sku?: string | null;
  price?: number | string | null;
  currency?: string | null;
  available?: boolean;
  options?: Record<string, string>;
}

interface DbProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  product_type: string;
  gender: string;
  category: string;
  description: string;
  description_html: string;
  images: string[];
  variants: DbVariant[];
  options: Array<{ name: string; values: string[] }>;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  available: boolean;
  collections: string[];
}

const SELECT =
  "id,handle,title,brand,product_type,gender,category,description,description_html,images,variants,options,price_min,price_max,currency,available,collections";

function money(amount: number | string | null | undefined, currency: string): Money {
  return { amount: String(amount ?? 0), currencyCode: currency || "USD" };
}

export function mapProduct(row: DbProduct): CatalogProduct {
  const currency = row.currency || "USD";
  const images = (row.images ?? []).map((url) => ({ node: { url, altText: row.title } }));
  const variants = (row.variants ?? []).map((v, i) => {
    const opts = Object.entries(v.options ?? {}).filter(([, val]) => !!val);
    return {
      node: {
        id: v.sku ? `${row.handle}::${v.sku}` : `${row.handle}::${i}`,
        title: opts.length ? opts.map(([, val]) => val).join(" / ") : "Default Title",
        price: money(v.price ?? row.price_min, v.currency || currency),
        compareAtPrice: null,
        availableForSale: v.available !== false,
        selectedOptions: opts.map(([name, value]) => ({ name, value })),
      } as CatalogVariant,
    };
  });

  if (variants.length === 0) {
    variants.push({
      node: {
        id: `${row.handle}::default`,
        title: "Default Title",
        price: money(row.price_min, currency),
        compareAtPrice: null,
        availableForSale: row.available,
        selectedOptions: [],
      },
    });
  }

  return {
    node: {
      id: row.id,
      handle: row.handle,
      title: row.title,
      description: row.description,
      descriptionHtml: row.description_html,
      productType: row.product_type,
      vendor: row.brand,
      gender: row.gender,
      category: row.category,
      priceRange: {
        minVariantPrice: money(row.price_min, currency),
        maxVariantPrice: money(row.price_max ?? row.price_min, currency),
      },
      images: { edges: images.length ? images : [] },
      variants: { edges: variants },
      options: row.options ?? [],
      collections: row.collections ?? [],
    },
  };
}

/* ---------- Queries ---------- */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "title-asc";

export interface ProductQuery {
  collection?: string;
  search?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(q: ProductQuery = {}): Promise<{
  products: CatalogProduct[];
  total: number;
}> {
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 24;

  let query = supabase.from("products").select(SELECT, { count: "exact" });

  if (q.collection && q.collection !== "all") {
    query = query.contains("collections", [q.collection]);
  }
  if (q.search) {
    const s = q.search.replace(/[%,]/g, " ").trim();
    if (s) query = query.or(`title.ilike.%${s}%,brand.ilike.%${s}%,product_type.ilike.%${s}%`);
  }
  if (q.brands && q.brands.length > 0) query = query.in("brand", q.brands);
  if (typeof q.minPrice === "number") query = query.gte("price_min", q.minPrice);
  if (typeof q.maxPrice === "number") query = query.lte("price_min", q.maxPrice);
  if (q.inStockOnly) query = query.eq("available", true);

  switch (q.sort) {
    case "price-asc":
      query = query.order("price_min", { ascending: true, nullsFirst: false });
      break;
    case "price-desc":
      query = query.order("price_min", { ascending: false, nullsFirst: false });
      break;
    case "title-asc":
      query = query.order("title", { ascending: true });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("available", { ascending: false }).order("title", { ascending: true });
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) throw error;

  return {
    products: ((data ?? []) as unknown as DbProduct[]).map(mapProduct),
    total: count ?? 0,
  };
}

export async function fetchProductByHandle(handle: string): Promise<CatalogProduct["node"] | null> {
  const { data, error } = await supabase.from("products").select(SELECT).eq("handle", handle).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProduct(data as unknown as DbProduct).node;
}

export async function fetchRelatedProducts(
  product: CatalogProduct["node"],
  limit = 4
): Promise<CatalogProduct[]> {
  const brandHandle = product.collections.find((c) => c.startsWith("brand-"));
  const tryFetch = async (collection?: string) => {
    let query = supabase.from("products").select(SELECT).neq("handle", product.handle).limit(limit);
    if (collection) query = query.contains("collections", [collection]);
    const { data } = await query;
    return ((data ?? []) as unknown as DbProduct[]).map(mapProduct);
  };

  let list = brandHandle ? await tryFetch(brandHandle) : [];
  if (list.length < limit) {
    const extra = await tryFetch(product.category);
    const seen = new Set(list.map((p) => p.node.handle));
    list = [...list, ...extra.filter((p) => !seen.has(p.node.handle))];
  }
  return list.slice(0, limit);
}

export async function fetchCollections(kind?: string): Promise<CollectionRecord[]> {
  let query = supabase.from("collections").select("*").order("sort_order", { ascending: true });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as CollectionRecord[];
}

export async function searchProducts(term: string, limit = 6): Promise<CatalogProduct[]> {
  const { products } = await fetchProducts({ search: term, pageSize: limit, sort: "featured" });
  return products;
}

export function formatPrice(amount: string | number, currency = "USD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value || 0);
  } catch {
    return `${currency} ${(value || 0).toFixed(2)}`;
  }
}
