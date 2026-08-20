import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SlidersHorizontal, ChevronDown, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, fetchCollections, SortKey } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "title-asc", label: "Name: A → Z" },
];

const PAGE_SIZE = 24;
const MAX_PRICE = 5000;

export default function Shop() {
  const { collection } = useParams<{ collection?: string }>();
  const [params, setParams] = useSearchParams();
  const key = collection ?? "all";
  const search = params.get("q") ?? "";

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(),
    staleTime: 1000 * 60 * 30,
  });

  const current = collections.find((c) => c.handle === key);
  const title = search ? `Search: “${search}”` : current?.title ?? "Shop All";

  const brandCollections = useMemo(
    () => collections.filter((c) => c.kind === "brand").slice(0, 40),
    [collections]
  );

  const [sort, setSort] = useState<SortKey>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [brands, setBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setPage(1);
  }, [key, search, sort, priceRange[0], priceRange[1], brands.length, inStockOnly]);

  useEffect(() => setSearchInput(search), [search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", key, search, sort, priceRange, brands, inStockOnly, page],
    queryFn: () =>
      fetchProducts({
        collection: key,
        search: search || undefined,
        brands: brands.length ? brands : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
        inStockOnly,
        sort,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const toggleBrand = (title: string) =>
    setBrands((prev) => (prev.includes(title) ? prev.filter((b) => b !== title) : [...prev, title]));

  const clearAll = () => {
    setBrands([]);
    setPriceRange([0, MAX_PRICE]);
    setInStockOnly(false);
  };

  const FiltersContent = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Filters</p>
        {(brands.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
          <button onClick={clearAll} className="text-xs text-accent hover:underline">
            Clear all
          </button>
        )}
      </div>
      <Accordion type="multiple" defaultValue={["price", "brand", "availability"]} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="text-xs uppercase tracking-widest">Price</AccordionTrigger>
          <AccordionContent>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={0}
              max={MAX_PRICE}
              step={50}
              className="mt-2"
            />
            <div className="flex justify-between mt-3 text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}{priceRange[1] >= MAX_PRICE ? "+" : ""}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-xs uppercase tracking-widest">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
              {brandCollections.map((b) => (
                <label key={b.handle} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={brands.includes(b.title)}
                    onCheckedChange={() => toggleBrand(b.title)}
                  />
                  <span className="truncate">{b.title}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-xs uppercase tracking-widest">Availability</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(!!v)} /> In stock only
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const subCollections = collections.filter((c) => c.parent === key);

  return (
    <>
      <section className="bg-warm py-12 lg:py-16 border-b border-border">
        <div className="container-coutr">
          <nav className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-foreground">Home</Link> ·{" "}
            <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="font-serif text-4xl lg:text-6xl font-light">{title}</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            {current?.description || "Explore our curated selection of premium designer pieces."}
          </p>

          <form
            className="mt-6 flex gap-2 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              const next = new URLSearchParams(params);
              if (searchInput.trim()) next.set("q", searchInput.trim());
              else next.delete("q");
              setParams(next);
            }}
          >
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products or brands"
              className="h-11 rounded-full bg-background"
            />
            <Button type="submit" className="rounded-full h-11 px-6 text-xs uppercase tracking-widest">
              Search
            </Button>
          </form>

          {subCollections.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {subCollections.map((c) => (
                <Link
                  key={c.handle}
                  to={`/collections/${c.handle}`}
                  className="text-xs uppercase tracking-widest border border-border rounded-full px-4 h-9 inline-flex items-center bg-background hover:border-foreground transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
            {total.toLocaleString()} product{total !== 1 && "s"}
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
                onChange={(e) => setSort(e.target.value as SortKey)}
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

      <section className="container-coutr py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="hidden lg:block sticky top-[calc(2.25rem+72px+56px+2rem)] h-fit max-h-[70vh] overflow-y-auto pr-1">
            <FiltersContent />
          </aside>

          <div>
            {isLoading ? (
              <div className={cn("grid grid-cols-2 gap-6", gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[4/5] w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 mt-4" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-lg">
                <p className="font-serif text-2xl mb-2">No products found</p>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Try adjusting your filters or search for a different style or brand.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid grid-cols-2 gap-6 lg:gap-8 transition-opacity",
                    gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
                    isFetching && "opacity-60"
                  )}
                >
                  {products.map((p) => (
                    <ProductCard key={p.node.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={page === 1}
                      onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Button>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Page {page} of {totalPages.toLocaleString()}
                    </span>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={page >= totalPages}
                      onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
