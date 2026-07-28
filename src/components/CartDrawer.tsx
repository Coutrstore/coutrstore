import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    isSyncing,
    setOpen,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-widest text-muted-foreground">
            {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <div className="px-6 py-4 border-b border-border bg-warm">
            {remaining > 0 ? (
              <p className="text-sm text-foreground mb-2">
                Add <span className="font-medium">{currency} {remaining.toFixed(2)}</span> more for
                <span className="text-accent"> free shipping</span>
              </p>
            ) : (
              <p className="text-sm text-success flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4" /> You unlocked free shipping!
              </p>
            )}
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="font-serif text-xl mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">Discover our latest arrivals.</p>
              <Button onClick={() => setOpen(false)} asChild className="rounded-full">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-5">
                {items.map((item) => {
                  const img = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.variantId} className="flex gap-4">
                      <Link
                        to={`/product/${item.product.node.handle}`}
                        onClick={() => setOpen(false)}
                        className="w-20 h-24 bg-warm rounded-md overflow-hidden flex-shrink-0"
                      >
                        {img && (
                          <img
                            src={img.url}
                            alt={img.altText ?? item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.node.handle}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-foreground line-clamp-2 hover:text-accent transition-colors"
                        >
                          {item.product.node.title}
                        </Link>
                        {item.selectedOptions.length > 0 && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map((o) => o.value).join(" • ")}
                          </p>
                        )}
                        <p className="text-sm font-medium text-foreground mt-1">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:text-accent"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:text-accent"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border bg-background px-6 py-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="font-serif text-2xl">{currency} {subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes and shipping calculated at checkout.</p>
              <Button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                size="lg"
                className="w-full rounded-full h-12 text-sm tracking-widest uppercase"
              >
                {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Secure Checkout"}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted & secure — powered by Shopify</span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
