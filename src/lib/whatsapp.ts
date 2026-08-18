import type { CartItem } from "@/stores/cartStore";
import { formatPrice } from "@/lib/catalog";

export const WHATSAPP_NUMBER = "447451250738";

export function buildWhatsAppOrderMessage(items: CartItem[]): string {
  const currency = items[0]?.price.currencyCode || "USD";
  const lines: string[] = [];
  lines.push("Hello Coutr Store, I'd like to place an order:");
  lines.push("");

  items.forEach((item, i) => {
    const p = item.product.node;
    const opts = item.selectedOptions
      .filter((o) => o.value && o.value !== "Default Title")
      .map((o) => `${o.name}: ${o.value}`)
      .join(", ");
    const lineTotal = parseFloat(item.price.amount) * item.quantity;
    lines.push(`${i + 1}. ${p.title}`);
    if (p.vendor) lines.push(`   Brand: ${p.vendor}`);
    if (opts) lines.push(`   ${opts}`);
    lines.push(`   Qty: ${item.quantity} × ${formatPrice(item.price.amount, item.price.currencyCode)} = ${formatPrice(lineTotal, item.price.currencyCode)}`);
    lines.push(`   Link: ${window.location.origin}/product/${p.handle}`);
    lines.push("");
  });

  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  lines.push(`Total: ${formatPrice(total, currency)}`);
  lines.push("");
  lines.push("Please confirm availability, shipping and payment details.");

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppCheckout(items: CartItem[]) {
  if (items.length === 0) return;
  window.open(buildWhatsAppUrl(buildWhatsAppOrderMessage(items)), "_blank", "noopener,noreferrer");
}

export function openWhatsAppEnquiry(text: string) {
  window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
}
