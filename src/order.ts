import { discount } from './discount';

type Item = { price: number; qty: number };

export function order(items: Item[], discountPct = 0, vatPct = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const off = discount(subtotal, discountPct);
  const vat = ((subtotal - off) * vatPct) / 100;
  const total = subtotal - off + vat;
  return { subtotal, discount: off, vat, total };
}
