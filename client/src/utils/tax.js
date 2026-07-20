export const TAX_RATE = 0.07;

export function calculateTax(subtotal) {
  return subtotal * TAX_RATE;
}
