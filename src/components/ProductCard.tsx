import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  product: ShopifyProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority }: Props) {
  const p = product.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [busy, setBusy] = useState(false);
  const [wished, setWished] = useState(false);

  const images = p.images.edges;
  const primaryImg = images[0]?.node;
  const secondaryImg = images[1]?.node;
  const variants = p.variants.edges;
  const firstVariant = variants[0]?.node;
  const compareAt = firstVariant?.compareAtPrice;
  const price = firstVariant?.price ?? p.priceRange.minVariantPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const soldOut = variants.every((v) => !v.node.availableForSale);

  const colorOption = p.options.find((o) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour");

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || soldOut) return;
    setBusy(true);
    try {
      await addItem({
        product,
        variantId: firstVariant.id,
        variantTitle: firstVariant.title,
        price: firstVariant.price,
        quantity: 1,
        selectedOptions: firstVariant.selectedOptions,
      });
      toast.success(`${p.title} added to cart`, { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="group relative">
      <Link to={`/product/${p.handle}`} className="block">
        <div className="relative overflow-hidden bg-warm aspect-[4/5] rounded-md img-zoom">
          {primaryImg && (
            <img
              src={primaryImg.url}
              alt={primaryImg.altText ?? p.title}
              loading={priority ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                secondaryImg && "group-hover:opacity-0"
              )}
            />
          )}
          {secondaryImg && (
            <img
              src={secondaryImg.url}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {onSale && (
              <span className="bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-medium">
                Sale
              </span>
            )}
            {soldOut && (
              <span className="bg-foreground text-background text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-medium">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWished((v) => !v);
            }}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
          >
            <Heart
              className={cn("w-4 h-4 transition-colors", wished ? "fill-accent text-accent" : "text-foreground")}
              strokeWidth={1.5}
            />
          </button>

          {/* Quick actions */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={busy || isLoading || soldOut}
              className="flex-1 h-10 bg-background text-foreground text-[11px] uppercase tracking-widest font-medium rounded-full flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ShoppingBag className="w-3.5 h-3.5" /> Quick Add</>}
            </button>
            <button
              className="w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Quick view"
              onClick={(e) => e.preventDefault()}
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <Link to={`/product/${p.handle}`} className="block">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {p.title}
          </h3>
        </Link>
        {p.vendor && <p className="text-xs text-muted-foreground uppercase tracking-widest">{p.vendor}</p>}
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-foreground font-medium">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          {onSale && compareAt && (
            <span className="text-xs text-muted-foreground line-through">
              {compareAt.currencyCode} {parseFloat(compareAt.amount).toFixed(2)}
            </span>
          )}
        </div>
        {colorOption && colorOption.values.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {colorOption.values.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: c.toLowerCase() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
