export function discount(subtotal: number, pct = 0): number {
  return (subtotal * pct) / 100;
}
