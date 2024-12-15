import { useCart } from "@/hooks/useCart";

export function CartItem({ item }: { item: any }) {
  const { removeFromCart } = useCart();

  return (
    <div className="py-4 border-b">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          {item.isDeal && item.selectedItems?.details && (
            <div className="text-sm text-gray-600 ml-4">
              <ul className="list-disc">
                {item.selectedItems.details.map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Quantity: {item.quantity || 1}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">
            ${(item.total * (item.quantity || 1)).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            Base: ${(item.price * (item.quantity || 1)).toFixed(2)}
            <br />
            Tax: ${(item.tax * (item.quantity || 1)).toFixed(2)}
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 text-sm hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
