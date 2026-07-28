import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Leaf, Users } from "lucide-react";
import lookbook from "@/assets/coutr/lookbook.jpg";
import hero from "@/assets/coutr/hero-main.jpg";

const pillars = [
  { icon: Sparkles, title: "Design-First", desc: "Every piece is designed with intention and considered detail." },
  { icon: Leaf, title: "Made Responsibly", desc: "Ethically sourced materials from partners we know and trust." },
  { icon: Users, title: "For the Modern", desc: "Fashion for people who value both style and substance." },
];

export default function About() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden -mt-[calc(2.25rem+72px)]">
        <img src={hero} alt="About Coutr Store" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative h-full container-coutr flex items-end pb-16 text-primary-foreground">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h1 className="font-serif text-5xl lg:text-6xl font-light max-w-2xl leading-tight">
              Fashion designed for a life well-lived.
            </h1>
          </div>
        </div>
      </section>

      <section className="container-coutr py-16 lg:py-24 max-w-4xl">
        <p className="font-serif text-2xl lg:text-3xl leading-relaxed text-foreground font-light">
          Coutr Store was built around a simple idea — that great fashion should feel effortless, look considered, and last beyond a season.
        </p>
        <div className="mt-10 grid gap-6 text-base text-muted-foreground leading-relaxed">
          <p>
            We work directly with premium mills, expert makers, and independent designers to bring pieces to you that combine timeless silhouettes with modern sensibility. From tailored menswear to fluid womenswear and considered footwear, every product is chosen because we'd wear it ourselves.
          </p>
          <p>
            Coutr is for the fashion-conscious — for those who care about how things are made and how they make you feel. We believe in fewer things, chosen with intention.
          </p>
        </div>
      </section>

      <section className="bg-warm py-16 lg:py-24">
        <div className="container-coutr grid md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div key={p.title} className="bg-background rounded-lg p-8 border border-border">
              <p.icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-coutr py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <img src={lookbook} alt="Coutr lookbook" className="rounded-lg w-full aspect-[4/5] object-cover" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">The Coutr Community</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight">Style, defined by you.</h2>
            <p className="mt-4 text-muted-foreground">
              Join a community of tastemakers around the world. Share how you style your Coutr pieces, and be part of the story.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Discover Coutr <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
