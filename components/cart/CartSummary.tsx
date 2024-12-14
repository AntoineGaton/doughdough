import { useCart } from "@/hooks/useCart";

export function CartSummary() {
  const { items } = useCart();
  
  const totals = items.reduce((acc, item) => ({
    subtotal: acc.subtotal + (item.price * (item.quantity || 1)),
    tax: acc.tax + (item.tax * (item.quantity || 1)),
    total: acc.total + (item.total * (item.quantity || 1))
  }), { subtotal: 0, tax: 0, total: 0 });

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>${totals.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Tax (13%):</span>
        <span>${totals.tax.toFixed(2)}</span>
      </div>
    </div>
  );
}