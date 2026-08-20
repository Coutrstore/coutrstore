import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Award, Headphones, Star } from "lucide-react";
import heroImg from "@/assets/coutr/hero-main.jpg";
import catMen from "@/assets/coutr/cat-men.jpg";
import catWomen from "@/assets/coutr/cat-women.jpg";
import catShoes from "@/assets/coutr/cat-shoes.jpg";
import catAcc from "@/assets/coutr/cat-accessories.jpg";
import lookbook from "@/assets/coutr/lookbook.jpg";
import { fetchProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { label: "Men", to: "/collections/men", img: catMen, tag: "New Season" },
  { label: "Women", to: "/collections/women", img: catWomen, tag: "Trending" },
  { label: "Shoes", to: "/collections/shoes", img: catShoes, tag: "Bestsellers" },
  { label: "Accessories", to: "/collections/accessories", img: catAcc, tag: "Editor's Pick" },
];

const styles = [
  { label: "Sneakers", to: "/collections/type-sneakers" },
  { label: "Outerwear", to: "/collections/type-jackets" },
  { label: "Tailoring", to: "/collections/type-blazers" },
  { label: "Dresses", to: "/collections/type-dresses" },
  { label: "Handbags", to: "/collections/bags" },
  { label: "Eyewear", to: "/collections/eyewear" },
];

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $150" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Encrypted checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day free returns" },
  { icon: Award, title: "Premium Quality", desc: "Curated craftsmanship" },
  { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
];

export default function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ pageSize: 8, sort: "featured" }),
  });
  const products = data?.products ?? [];

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden -mt-[calc(2.25rem+72px)]">
        <img
          src={heroImg}
          alt="Coutr Store — Premium Fashion Campaign"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
        <div className="absolute inset-0 flex items-end pb-16 lg:pb-24">
          <div className="container-coutr">
            <div className="max-w-2xl animate-slide-up">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/70 mb-4">
                New Season · Autumn Winter 26
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-foreground font-light">
                Elevate Your <em className="italic font-normal text-accent">Style</em> with Coutr Store
              </h1>
              <p className="mt-5 text-lg text-foreground/80 max-w-lg font-light">
                Discover premium clothing and footwear designed for everyday confidence.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/collections/men"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-widest hover:bg-accent transition-colors"
                >
                  Shop Men <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/collections/women"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-background text-foreground border border-foreground/20 rounded-full text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  Shop Women <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS BAR */}
      <section className="border-y border-border bg-background">
        <div className="container-coutr grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 py-8">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <p.icon className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.6} />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="container-coutr py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Explore</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light">Shop by Category</h2>
          </div>
          <Link to="/shop" className="story-link text-sm uppercase tracking-widest hidden sm:block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-warm img-zoom"
            >
              <img src={c.img} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-1">{c.tag}</p>
                <h3 className="font-serif text-2xl lg:text-3xl">{c.label}</h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-90">
                  Shop now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="bg-warm py-16 lg:py-24">
        <div className="container-coutr">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">The Edit</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light">Featured Collection</h2>
            </div>
            <Link to="/shop" className="story-link text-sm uppercase tracking-widest hidden sm:block">
              Shop all
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 mt-4" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-lg border border-border">
              <p className="font-serif text-2xl mb-2">No products found</p>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                We couldn't load the collection right now. Please refresh to try again.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SHOP BY STYLE */}
      <section className="container-coutr py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Curated</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light">Shop by Style</h2>
          <p className="mt-4 text-muted-foreground">
            From streetwear to luxury — pieces that speak to who you are.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {styles.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="group aspect-square bg-warm hover:bg-primary hover:text-primary-foreground transition-colors duration-500 rounded-lg flex items-center justify-center text-center p-4"
            >
              <span className="font-serif text-xl lg:text-2xl">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={lookbook} alt="The Coutr Lookbook" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative h-full container-coutr flex items-center">
          <div className="max-w-xl text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 text-primary-foreground/80">Limited-Time Offer</p>
            <h2 className="font-serif text-5xl lg:text-6xl font-light leading-tight">
              The Season's<br />Defining Pieces
            </h2>
            <p className="mt-4 text-primary-foreground/85 max-w-md">
              Up to 30% off on selected styles. Discover essentials that will define your wardrobe.
            </p>
            <Link
              to="/collections/new"
              className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-accent text-accent-foreground rounded-full text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Shop The Edit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP THE LOOK */}
      <section className="container-coutr py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-warm img-zoom">
            <img src={heroImg} alt="Shop the Look" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Shop The Look</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight">
              One outfit,<br />endless expression.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md">
              Get the complete look inspired by our latest editorial. Handpicked pieces styled to perfection.
            </p>
            <Link
              to="/lookbook"
              className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Explore The Lookbook <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - empty state per policy */}
      <section className="bg-warm py-16 lg:py-24">
        <div className="container-coutr">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Customer Stories</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-background rounded-lg p-8 border border-border">
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 text-muted-foreground/40" strokeWidth={1} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  No reviews yet — real customer stories will appear here.
                </p>
                <p className="text-xs text-muted-foreground mt-6 uppercase tracking-widest">Awaiting reviews</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-coutr py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Join The Community</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light">Sign up for early access</h2>
          <p className="mt-4 text-muted-foreground">
            Be the first to shop new collections, exclusive drops, and receive 10% off your first order.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-5 rounded-full bg-background border border-border focus:outline-none focus:border-accent transition-colors text-sm"
            />
            <button
              type="submit"
              className="h-12 px-8 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
