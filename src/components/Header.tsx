import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { fetchCollections } from "@/lib/catalog";
import AnnouncementBar from "./AnnouncementBar";

type MenuColumn = { title: string; links: { label: string; to: string }[] };

const megaMenu: Record<string, MenuColumn[]> = {
  Men: [
    {
      title: "Clothing",
      links: [
        { label: "All Menswear", to: "/collections/men-clothing" },
        { label: "T-Shirts", to: "/collections/type-t-shirts" },
        { label: "Shirts", to: "/collections/type-shirts" },
        { label: "Jackets & Coats", to: "/collections/type-jackets" },
        { label: "Knitwear", to: "/collections/type-knitwears" },
        { label: "Trousers & Jeans", to: "/collections/type-jeans" },
      ],
    },
    {
      title: "Footwear",
      links: [
        { label: "All Shoes", to: "/collections/men-shoes" },
        { label: "Sneakers", to: "/collections/type-sneakers" },
        { label: "Loafers", to: "/collections/type-loafers" },
        { label: "Boots", to: "/collections/type-boots" },
      ],
    },
    {
      title: "Accessories",
      links: [
        { label: "Bags", to: "/collections/men-bags" },
        { label: "Wallets", to: "/collections/type-wallets" },
        { label: "Eyewear", to: "/collections/men-eyewear" },
        { label: "Hats", to: "/collections/type-hats" },
      ],
    },
  ],
  Women: [
    {
      title: "Clothing",
      links: [
        { label: "All Womenswear", to: "/collections/women-clothing" },
        { label: "Dresses", to: "/collections/type-dresses" },
        { label: "Tops", to: "/collections/type-tops" },
        { label: "Coats", to: "/collections/type-coats" },
        { label: "Skirts", to: "/collections/type-skirts" },
      ],
    },
    {
      title: "Footwear",
      links: [
        { label: "All Shoes", to: "/collections/women-shoes" },
        { label: "Heels", to: "/collections/type-heels" },
        { label: "Sneakers", to: "/collections/type-sneakers" },
        { label: "Sandals", to: "/collections/type-sandals" },
      ],
    },
    {
      title: "Bags & More",
      links: [
        { label: "Handbags", to: "/collections/women-bags" },
        { label: "Shoulder Bags", to: "/collections/type-shoulder-bags" },
        { label: "Eyewear", to: "/collections/women-eyewear" },
        { label: "Fragrance", to: "/collections/women-fragrance" },
      ],
    },
  ],
  Shoes: [
    {
      title: "Categories",
      links: [
        { label: "All Shoes", to: "/collections/shoes" },
        { label: "Sneakers", to: "/collections/type-sneakers" },
        { label: "Boots", to: "/collections/type-boots" },
        { label: "Loafers", to: "/collections/type-loafers" },
        { label: "Heels", to: "/collections/type-heels" },
        { label: "Sandals", to: "/collections/type-sandals" },
      ],
    },
  ],
  Accessories: [
    {
      title: "Shop",
      links: [
        { label: "All Accessories", to: "/collections/accessories" },
        { label: "Handbags", to: "/collections/bags" },
        { label: "Wallets & Card Cases", to: "/collections/type-wallets" },
        { label: "Jewellery", to: "/collections/type-necklaces" },
        { label: "Scarves", to: "/collections/type-scarves" },
        { label: "Eyewear", to: "/collections/eyewear" },
        { label: "Fragrance", to: "/collections/fragrance" },
      ],
    },
  ],
};

const primaryLinks = ["Men", "Women", "Shoes", "Accessories"] as const;

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");

  const { data: brands = [] } = useQuery({
    queryKey: ["collections", "brand"],
    queryFn: () => fetchCollections("brand"),
    staleTime: 1000 * 60 * 30,
  });

  const brandMenu: MenuColumn[] = [0, 1, 2].map((col) => ({
    title: col === 0 ? "Designers" : " ".repeat(col + 1),
    links: brands.slice(col * 8, col * 8 + 8).map((b) => ({ label: b.title, to: `/collections/${b.handle}` })),
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setHovered(null);
    setSearchOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`);
    setSearchOpen(false);
    setTerm("");
  };

  const activeMenu = hovered === "Brands" ? brandMenu : hovered ? megaMenu[hovered] : null;

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
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex-shrink-0 mr-auto lg:mr-0">
            <span className="font-serif text-2xl lg:text-[28px] font-medium tracking-[0.02em] text-foreground">
              Coutr<span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {primaryLinks.map((label) => (
              <div key={label} className="h-[72px] flex items-center" onMouseEnter={() => setHovered(label)}>
                <Link
                  to={`/collections/${label === "Accessories" ? "accessories" : label === "Shoes" ? "shoes" : label.toLowerCase()}`}
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
            <div className="h-[72px] flex items-center" onMouseEnter={() => setHovered("Brands")}>
              <Link
                to="/shop"
                className={cn(
                  "text-[13px] tracking-[0.14em] uppercase font-medium transition-colors flex items-center gap-1",
                  hovered === "Brands" ? "text-accent" : "text-foreground/85 hover:text-foreground"
                )}
              >
                Brands
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex text-foreground/85 hover:text-accent transition-colors"
            >
              {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />}
            </button>
            <Link to="/about" aria-label="Account" className="hidden sm:flex text-foreground/85 hover:text-accent transition-colors">
              <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </Link>
            <Link to="/shop" aria-label="Wishlist" className="hidden sm:flex text-foreground/85 hover:text-accent transition-colors">
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

        {searchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <form onSubmit={submitSearch} className="container-coutr py-4 flex gap-2">
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 h-11 px-5 rounded-full bg-warm border border-border text-sm focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {activeMenu && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 bg-background border-t border-border shadow-elegant animate-fade-in"
            onMouseEnter={() => setHovered(hovered)}
          >
            <div className="container-coutr py-10 grid grid-cols-4 gap-10">
              {activeMenu.map((col) => (
                <div key={col.title}>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} className="text-[14px] text-foreground/85 hover:text-accent transition-colors">
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
                <Link to="/shop" className="story-link text-sm text-foreground mt-4 w-fit">
                  Shop all →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in max-h-[calc(100vh-6rem)] overflow-y-auto">
          <nav className="container-coutr py-6 space-y-4">
            {primaryLinks.map((label) => (
              <div key={label} className="border-b border-border pb-3">
                <Link
                  to={`/collections/${label.toLowerCase()}`}
                  className="block text-lg font-serif text-foreground py-2"
                >
                  {label}
                </Link>
                <div className="flex flex-wrap gap-2 pb-1">
                  {(megaMenu[label]?.[0]?.links ?? []).slice(1, 5).map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="text-xs uppercase tracking-widest border border-border rounded-full px-3 h-8 inline-flex items-center"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/shop" className="block text-lg font-serif text-foreground py-2 border-b border-border">
              All Products
            </Link>
            <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <button onClick={() => { openCart(); setMobileOpen(false); }}>Cart</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
