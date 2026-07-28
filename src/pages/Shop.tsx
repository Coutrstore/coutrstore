import { useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, ChevronDown, LayoutGrid, LayoutList, X } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const sortOptions = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "title-asc", label: "Name: A → Z" },
];

const collectionLabels: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  shoes: "Shoes & Sneakers",
  accessories: "Accessories",
  new: "New Arrivals",
  "best-sellers": "Best Sellers",
};

export default function Shop() {
  const { collection } = useParams<{ collection?: string }>();
  const [params] = useSearchParams();
  const key = collection ?? "all";
  const title = collectionLabels[key] ?? "Shop All";

  const query = useMemo(() => {
    const filters: string[] = [];
    if (collection && !["new", "best-sellers"].includes(collection)) {
      filters.push(`product_type:${collection} OR tag:${collection}`);
    }
    const type = params.get("type");
    if (type) filters.push(`tag:${type}`);
    return filters.length ? filters.join(" AND ") : undefined;
  }, [collection, params]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", key, query],
    queryFn: () => fetchProducts(48, query),
  });

  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filtered = useMemo(() => {
    const list = [...products];
    const [min, max] = priceRange;
    const priced = list.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= min && price <= max;
    });
    switch (sort) {
      case "price-asc":
        return priced.sort(
          (a, b) =>
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
      case "price-desc":
        return priced.sort(
          (a, b) =>
            parseFloat(b.node.priceRange.minVariantPrice.amount) -
            parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
      case "title-asc":
        return priced.sort((a, b) => a.node.title.localeCompare(b.node.title));
      default:
        return priced;
    }
  }, [products, sort, priceRange]);

  const FiltersContent = () => (
    <Accordion type="multiple" defaultValue={["price", "size", "color", "availability"]} className="w-full">
      <AccordionItem value="price">
        <AccordionTrigger className="text-xs uppercase tracking-widest">Price</AccordionTrigger>
        <AccordionContent>
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            min={0}
            max={1000}
            step={10}
            className="mt-2"
          />
          <div className="flex justify-between mt-3 text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="size">
        <AccordionTrigger className="text-xs uppercase tracking-widest">Size</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-4 gap-2">
            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                className="border border-border rounded-md h-9 text-xs hover:border-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="color">
        <AccordionTrigger className="text-xs uppercase tracking-widest">Color</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {["#000", "#fff", "#c9a084", "#4a3728", "#8b0000", "#1a3a5f", "#87a878"].map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                className="w-7 h-7 rounded-full border border-border hover:ring-2 hover:ring-accent hover:ring-offset-2 transition"
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="availability">
        <AccordionTrigger className="text-xs uppercase tracking-widest">Availability</AccordionTrigger>
        <AccordionContent className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox /> In stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox /> On sale
          </label>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      {/* Banner */}
      <section className="bg-warm py-12 lg:py-16 border-b border-border">
        <div className="container-coutr">
          <nav className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-foreground">Home</Link> · <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="font-serif text-4xl lg:text-6xl font-light">{title}</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Explore our curated selection of premium pieces designed to elevate your wardrobe.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-[calc(2.25rem+64px)] lg:top-[calc(2.25rem+72px)] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-coutr flex items-center justify-between h-14 gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden inline-flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl text-left">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6"><FiltersContent /></div>
            </SheetContent>
          </Sheet>

          <p className="hidden lg:block text-xs uppercase tracking-widest text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 && "s"}
          </p>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-1 border border-border rounded-full p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", gridCols === 3 && "bg-primary text-primary-foreground")}
                aria-label="Grid 3 columns"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", gridCols === 4 && "bg-primary text-primary-foreground")}
                aria-label="Grid 4 columns"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-transparent text-sm pr-6 pl-3 h-9 border border-border rounded-full cursor-pointer focus:outline-none focus:border-foreground"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>Sort: {o.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <section className="container-coutr py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="hidden lg:block sticky top-[calc(2.25rem+72px+56px+2rem)] h-fit">
            <FiltersContent />
          </aside>

          <div>
            {isLoading ? (
              <div className={cn("grid grid-cols-2 gap-6", gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[4/5] w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 mt-4" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-lg">
                <p className="font-serif text-2xl mb-2">No products found</p>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  There are no products in this collection yet. Ask the chat to create products for your store — just describe the product and price.
                </p>
              </div>
            ) : (
              <div className={cn("grid grid-cols-2 gap-6 lg:gap-8", gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                {filtered.map((p) => (
                  <ProductCard key={p.node.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
