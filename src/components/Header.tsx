import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import AnnouncementBar from "./AnnouncementBar";

const megaMenu: Record<string, { title: string; links: { label: string; to: string }[] }[]> = {
  Men: [
    {
      title: "Clothing",
      links: [
        { label: "New Arrivals", to: "/collections/men?filter=new" },
        { label: "T-Shirts", to: "/collections/men?type=t-shirts" },
        { label: "Shirts", to: "/collections/men?type=shirts" },
        { label: "Jackets & Coats", to: "/collections/men?type=jackets" },
        { label: "Trousers", to: "/collections/men?type=trousers" },
      ],
    },
    {
      title: "Footwear",
      links: [
        { label: "Sneakers", to: "/collections/shoes?type=sneakers" },
        { label: "Formal Shoes", to: "/collections/shoes?type=formal" },
        { label: "Boots", to: "/collections/shoes?type=boots" },
      ],
    },
    {
      title: "Shop by Style",
      links: [
        { label: "Streetwear", to: "/collections/men?style=streetwear" },
        { label: "Formal", to: "/collections/men?style=formal" },
        { label: "Luxury", to: "/collections/men?style=luxury" },
      ],
    },
  ],
  Women: [
    {
      title: "Clothing",
      links: [
        { label: "New Arrivals", to: "/collections/women?filter=new" },
        { label: "Dresses", to: "/collections/women?type=dresses" },
        { label: "Tops", to: "/collections/women?type=tops" },
        { label: "Outerwear", to: "/collections/women?type=outerwear" },
        { label: "Skirts & Pants", to: "/collections/women?type=bottoms" },
      ],
    },
    {
      title: "Footwear",
      links: [
        { label: "Heels", to: "/collections/shoes?type=heels" },
        { label: "Sneakers", to: "/collections/shoes?type=sneakers" },
        { label: "Flats", to: "/collections/shoes?type=flats" },
      ],
    },
    {
      title: "Shop by Style",
      links: [
        { label: "Casual", to: "/collections/women?style=casual" },
        { label: "Formal", to: "/collections/women?style=formal" },
        { label: "Summer", to: "/collections/women?style=summer" },
      ],
    },
  ],
  Shoes: [
    {
      title: "Categories",
      links: [
        { label: "All Sneakers", to: "/collections/shoes?type=sneakers" },
        { label: "Formal", to: "/collections/shoes?type=formal" },
        { label: "Boots", to: "/collections/shoes?type=boots" },
        { label: "Sandals", to: "/collections/shoes?type=sandals" },
      ],
    },
  ],
  Accessories: [
    {
      title: "Shop",
      links: [
        { label: "Bags", to: "/collections/accessories?type=bags" },
        { label: "Jewelry", to: "/collections/accessories?type=jewelry" },
        { label: "Belts", to: "/collections/accessories?type=belts" },
        { label: "Sunglasses", to: "/collections/accessories?type=sunglasses" },
      ],
    },
  ],
};

const primaryLinks = ["Men", "Women", "Shoes", "Accessories"] as const;

export default function Header() {
  const { pathname } = useLocation();
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setHovered(null);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" onMouseLeave={() => setHovered(null)}>
      <AnnouncementBar />

      <div
        className={cn(
          "transition-all duration-500 backdrop-blur-md border-b",
          scrolled || hovered
            ? "bg-background/95 border-border shadow-soft"
            : "bg-background/80 border-transparent"
        )}
      >
        <div className="container-coutr flex items-center justify-between h-16 lg:h-[72px] gap-6">
          {/* Mobile burger */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-auto lg:mr-0">
            <span className="font-serif text-2xl lg:text-[28px] font-medium tracking-[0.02em] text-foreground">
              Coutr<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {primaryLinks.map((label) => (
              <div
                key={label}
                className="h-[72px] flex items-center"
                onMouseEnter={() => setHovered(label)}
              >
                <Link
                  to={`/collections/${label.toLowerCase()}`}
                  className={cn(
                    "text-[13px] tracking-[0.14em] uppercase font-medium transition-colors flex items-center gap-1",
                    hovered === label ? "text-accent" : "text-foreground/85 hover:text-foreground"
                  )}
                >
                  {label}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Link>
              </div>
            ))}
            <Link to="/journal" className="text-[13px] tracking-[0.14em] uppercase font-medium text-foreground/85 hover:text-foreground">
              Journal
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button aria-label="Search" className="hidden sm:flex text-foreground/85 hover:text-accent transition-colors">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>
            <Link to="/account" aria-label="Account" className="hidden sm:flex text-foreground/85 hover:text-accent transition-colors">
              <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:flex text-foreground/85 hover:text-accent transition-colors">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </Link>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative text-foreground/85 hover:text-accent transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-medium w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {hovered && megaMenu[hovered] && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 bg-background border-t border-border shadow-elegant animate-fade-in"
            onMouseEnter={() => setHovered(hovered)}
          >
            <div className="container-coutr py-10 grid grid-cols-4 gap-10">
              {megaMenu[hovered].map((col) => (
                <div key={col.title}>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className="text-[14px] text-foreground/85 hover:text-accent transition-colors"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="bg-warm rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Featured</p>
                  <h4 className="font-serif text-xl text-foreground leading-tight">
                    The New Season Collection
                  </h4>
                </div>
                <Link
                  to={`/collections/${hovered.toLowerCase()}`}
                  className="story-link text-sm text-foreground mt-4 w-fit"
                >
                  Shop now →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in max-h-[calc(100vh-6rem)] overflow-y-auto">
          <nav className="container-coutr py-6 space-y-4">
            {primaryLinks.map((label) => (
              <Link
                key={label}
                to={`/collections/${label.toLowerCase()}`}
                className="block text-lg font-serif text-foreground py-2 border-b border-border"
              >
                {label}
              </Link>
            ))}
            <Link to="/journal" className="block text-lg font-serif text-foreground py-2 border-b border-border">
              Journal
            </Link>
            <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
              <Link to="/account">Account</Link>
              <Link to="/wishlist">Wishlist</Link>
              <button onClick={() => { openCart(); setMobileOpen(false); }}>Cart</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
