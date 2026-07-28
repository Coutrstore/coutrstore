import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Men", to: "/collections/men" },
      { label: "Women", to: "/collections/women" },
      { label: "Shoes", to: "/collections/shoes" },
      { label: "Accessories", to: "/collections/accessories" },
      { label: "New Arrivals", to: "/collections/new" },
      { label: "Best Sellers", to: "/collections/best-sellers" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Help Center", to: "/help" },
      { label: "FAQs", to: "/faqs" },
      { label: "Shipping", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "Size Guide", to: "/size-guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Coutr", to: "/about" },
      { label: "Journal", to: "/journal" },
      { label: "Sustainability", to: "/sustainability" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container-coutr py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link to="/" className="font-serif text-3xl font-medium tracking-tight">
              Coutr<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 max-w-xs leading-relaxed">
              Elevate your style with modern, elegant, and premium fashion designed for everyday confidence.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4 font-medium">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-primary-foreground/85 hover:text-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/15 flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-2">Join the list</p>
            <form className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 pl-9 pr-3 bg-transparent border border-primary-foreground/20 rounded-full text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-5 bg-accent text-accent-foreground text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-primary-foreground/60">
            <div className="flex gap-2">
              {["Visa", "MC", "Amex", "Apple Pay", "PayPal"].map((p) => (
                <span key={p} className="px-2 py-1 border border-primary-foreground/15 rounded text-[10px] uppercase tracking-widest">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Coutr Store. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-accent transition-colors">United States (USD $)</button>
            <button className="hover:text-accent transition-colors">English</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
