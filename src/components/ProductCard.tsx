import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import { CatalogProduct, formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  product: CatalogProduct;
  priority?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  ivory: "#f6f2e9",
  cream: "#f3ead9",
  beige: "#d9c7ab",
  camel: "#c19a6b",
  brown: "#6b4a2f",
  tan: "#c08a5a",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  silver: "#c0c0c0",
  navy: "#1b2a4a",
  blue: "#2e5aa8",
  green: "#3c6e47",
  olive: "#6b6b3a",
  red: "#a72020",
  burgundy: "#5c1a26",
  pink: "#e2a3b6",
  purple: "#6b4a8a",
  yellow: "#e3c34a",
  orange: "#d9772b",
  gold: "#c8a349",
  multicolor: "linear-gradient(135deg,#e35d5b,#e3c34a,#3c6e47,#2e5aa8)",
};

function swatch(value: string) {
  const key = value.toLowerCase();
  const found = Object.keys(COLOR_MAP).find((c) => key.includes(c));
  return found ? COLOR_MAP[found] : "#d8d2c8";
}

export default function ProductCard({ product, priority }: Props) {
  const p = product.node;
  const addItem = useCartStore((s) => s.addItem);
  const [busy, setBusy] = useState(false);
  const [wished, setWished] = useState(false);

  const images = p.images.edges;
  const primaryImg = images[0]?.node;
  const secondaryImg = images[1]?.node;
  const variants = p.variants.edges;
  const firstVariant = variants[0]?.node;
  const price = firstVariant?.price ?? p.priceRange.minVariantPrice;
  const soldOut = variants.every((v) => !v.node.availableForSale);
  const needsChoice = p.options.some((o) => o.values.length > 1);

  const colorOption = p.options.find((o) => /colou?r/i.test(o.name));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || soldOut) return;
    setBusy(true);
    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
    toast.success(`${p.title} added to cart`, { position: "top-center" });
    setBusy(false);
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

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {soldOut && (
              <span className="bg-foreground text-background text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-medium">
                Sold Out
              </span>
            )}
          </div>

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

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            {needsChoice ? (
              <span className="w-full h-10 bg-background text-foreground text-[11px] uppercase tracking-widest font-medium rounded-full flex items-center justify-center gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Choose Options
              </span>
            ) : (
              <button
                onClick={handleQuickAdd}
                disabled={busy || soldOut}
                className="w-full h-10 bg-background text-foreground text-[11px] uppercase tracking-widest font-medium rounded-full flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ShoppingBag className="w-3.5 h-3.5" /> Quick Add</>}
              </button>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        {p.vendor && <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">{p.vendor}</p>}
        <Link to={`/product/${p.handle}`} className="block">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {p.title}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-foreground font-medium">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        </div>
        {colorOption && colorOption.values.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {colorOption.values.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ background: swatch(c) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
