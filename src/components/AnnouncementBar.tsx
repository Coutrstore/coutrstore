import { useEffect, useState } from "react";
import { Truck, ShieldCheck, RotateCcw, Sparkles, Tag } from "lucide-react";

const messages = [
  { icon: Truck, text: "Free Shipping on orders over $150" },
  { icon: RotateCcw, text: "Easy 30-day returns, no questions asked" },
  { icon: ShieldCheck, text: "Secure checkout via Shopify" },
  { icon: Sparkles, text: "New Season Collection is here" },
  { icon: Tag, text: "Sign up and get 10% off your first order" },
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, []);
  const Msg = messages[i];
  const Icon = Msg.icon;

  return (
    <div className="bg-primary text-primary-foreground text-xs sm:text-[13px] tracking-wide">
      <div className="container-coutr h-9 flex items-center justify-center gap-2 overflow-hidden">
        <div key={i} className="flex items-center gap-2 animate-fade-in-slow">
          <Icon className="w-3.5 h-3.5 opacity-80" strokeWidth={1.5} />
          <span className="font-light">{Msg.text}</span>
        </div>
      </div>
    </div>
  );
}
