import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast({
      title: "Message sent",
      description: "Thank you for reaching out. Our team will respond within 24 hours.",
    });
    setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const update = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputCls =
    "w-full h-11 px-4 rounded-full border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <section className="container-coutr py-16 lg:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Get in Touch</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light">We'd love to hear from you.</h1>
        <p className="mt-4 text-muted-foreground">
          Questions, styling advice, or press inquiries — our team is ready to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12">
        <aside className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "hello@coutrstore.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 010-1234" },
            { icon: MapPin, label: "Address", value: "128 Fashion Ave, New York, NY 10001" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4 p-6 bg-warm rounded-lg">
              <c.icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{c.label}</p>
                <p className="text-sm text-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </aside>

        <form onSubmit={handleSubmit} className="space-y-4 bg-background rounded-lg border border-border p-8">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First name" value={form.firstName} onChange={update("firstName")} className={inputCls} />
            <input required placeholder="Last name" value={form.lastName} onChange={update("lastName")} className={inputCls} />
          </div>
          <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} className={inputCls} />
          <input required placeholder="Subject" value={form.subject} onChange={update("subject")} className={inputCls} />
          <textarea
            required
            placeholder="Your message..."
            value={form.message}
            onChange={update("message")}
            className="w-full min-h-[140px] p-4 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors resize-y"
          />
          <Button type="submit" disabled={isSubmitting} className="rounded-full h-11 px-8 uppercase tracking-widest text-xs">
            <Send className="w-3.5 h-3.5 mr-2" /> {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
