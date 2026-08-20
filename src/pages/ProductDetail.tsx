import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Heart, Loader2, Truck, RotateCcw, ShieldCheck, Ruler, Star, ChevronRight } from "lucide-react";
import { fetchProductByHandle, fetchRelatedProducts, formatPrice, CatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isLoading = useCartStore((s) => s.isLoading);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductByHandle(slug || ""),
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["products", "related", slug],
    queryFn: () => fetchRelatedProducts(product!, 4),
    enabled: !!product,
  });

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants.edges;
    if (Object.keys(selectedOptions).length === 0) return variants[0]?.node ?? null;
    return (
      variants.find((v) =>
        v.node.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
      )?.node ?? variants[0]?.node ?? null
    );
  }, [product, selectedOptions]);

  if (loadingProduct) {
    return (
      <div className="container-coutr py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-[4/5] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-coutr py-24 text-center">
        <p className="font-serif text-3xl mb-3">Product not found</p>
        <p className="text-muted-foreground mb-6">This piece may no longer be available.</p>
        <Button asChild className="rounded-full">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const images = product.images.edges;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const soldOut = !selectedVariant?.availableForSale;

  const handleAdd = () => {
    if (!selectedVariant || soldOut) return false;
    const missing = product.options.filter((o) => o.values.length > 1 && !selectedOptions[o.name]);
    if (missing.length > 0) {
      toast.error(`Please select ${missing.map((m) => m.name).join(", ")}`, { position: "top-center" });
      return false;
    }
    const productWrapper: CatalogProduct = { node: product };
    addItem({
      product: productWrapper,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });
    toast.success("Added to your cart", { position: "top-center" });
    return true;
  };

  const handleBuyNow = () => {
    if (handleAdd()) openCart();
  };

  return (
    <>
      <div className="container-coutr py-6">
        <nav className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{product.title}</span>
        </nav>
      </div>

      <section className="container-coutr grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16 pb-16">
        {/* Gallery */}
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="hidden lg:flex flex-col gap-3 overflow-y-auto max-h-[720px]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "aspect-[4/5] rounded-md overflow-hidden bg-warm border-2 transition-all",
                  activeImg === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={img.node.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="col-span-full lg:col-span-1">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-warm relative img-zoom">
              {images[activeImg] && (
                <img
                  src={images[activeImg].node.url}
                  alt={product.title}
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              )}
              {onSale && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-sm font-medium">
                  Sale
                </span>
              )}
            </div>
            {/* mobile thumbs */}
            <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "flex-shrink-0 w-16 aspect-[4/5] rounded-md overflow-hidden border-2",
                    activeImg === i ? "border-foreground" : "border-transparent opacity-70"
                  )}
                >
                  <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          {product.vendor && (
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{product.vendor}</p>
          )}
          <h1 className="font-serif text-3xl lg:text-4xl leading-tight text-foreground">{product.title}</h1>

          {/* Rating placeholder — no fake reviews per policy */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 text-muted-foreground/30" strokeWidth={1} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl font-medium text-foreground">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {onSale && compareAt && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Taxes and shipping confirmed with our team on WhatsApp.
          </p>

          <div className="mt-6 space-y-5">
            {product.options.filter((o) => o.values.length > 1).map((opt) => (
              <div key={opt.name}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-foreground font-medium">
                    {opt.name}: <span className="text-muted-foreground">{selectedOptions[opt.name] ?? "Select"}</span>
                  </p>
                  {opt.name.toLowerCase() === "size" && (
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 uppercase tracking-widest">
                      <Ruler className="w-3 h-3" /> Size Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((v) => {
                    const active = selectedOptions[opt.name] === v;
                    const isColor = opt.name.toLowerCase().includes("color") || opt.name.toLowerCase().includes("colour");
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: v }))}
                        className={cn(
                          "border rounded-md text-xs uppercase tracking-widest transition-all",
                          isColor ? "w-10 h-10 rounded-full flex items-center justify-center p-1" : "h-10 px-4 min-w-[3rem]",
                          active
                            ? "border-foreground ring-2 ring-foreground ring-offset-2"
                            : "border-border hover:border-foreground"
                        )}
                        style={isColor ? { backgroundColor: v.toLowerCase() } : {}}
                        title={v}
                      >
                        {!isColor && v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quantity + Add */}
          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex items-center border border-border rounded-full h-12">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-full text-lg"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-full text-lg"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAdd}
              disabled={soldOut || isLoading}
              className="flex-1 rounded-full h-12 uppercase tracking-widest text-sm"
              size="lg"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : soldOut ? "Sold Out" : "Add to Cart"}
            </Button>
            <button
              onClick={() => setWished((v) => !v)}
              className="w-12 h-12 border border-border rounded-full flex items-center justify-center hover:border-foreground transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={cn("w-4 h-4", wished && "fill-accent text-accent")} strokeWidth={1.5} />
            </button>
          </div>

          <Button
            onClick={handleBuyNow}
            disabled={soldOut || isLoading}
            variant="secondary"
            size="lg"
            className="w-full mt-3 rounded-full h-12 uppercase tracking-widest text-sm bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Buy It Now
          </Button>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 pb-4 border-b border-border">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto text-foreground/70" strokeWidth={1.5} />
              <p className="text-xs mt-2 text-muted-foreground">Free shipping over $150</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto text-foreground/70" strokeWidth={1.5} />
              <p className="text-xs mt-2 text-muted-foreground">30-day returns</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-foreground/70" strokeWidth={1.5} />
              <p className="text-xs mt-2 text-muted-foreground">Secure checkout</p>
            </div>
          </div>

          {/* Accordions */}
          <Accordion type="multiple" defaultValue={["desc"]} className="mt-4">
            <AccordionItem value="desc">
              <AccordionTrigger className="text-sm uppercase tracking-widest">Description</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {product.descriptionHtml ? (
                  <div
                    className="prose-sm [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2 space-y-2"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : (
                  product.description || "No description available."
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="materials">
              <AccordionTrigger className="text-sm uppercase tracking-widest">Materials & Care</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Premium materials, thoughtfully sourced. Care instructions provided on the garment tag.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm uppercase tracking-widest">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Free standard shipping on orders over $150. Complimentary 30-day returns.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Related */}
      {related.length > 1 && (
        <section className="bg-warm py-16 lg:py-20">
          <div className="container-coutr">
            <h2 className="font-serif text-3xl lg:text-4xl font-light mb-8">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {related.filter((p) => p.node.handle !== slug).slice(0, 4).map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
