/**
 * @fileoverview Component for rendering individual items in the shopping cart
 * 
 * Dependencies:
 * - @/hooks/useCart: Cart management hook
 * - @/data/ingredients: Ingredient data for custom pizzas
 * 
 * Upstream:
 * - Used by components/CartDrawer.tsx
 * 
 * Features:
 * - Displays item name, quantity, and price
 * - Shows custom pizza ingredients if applicable
 * - Shows deal items if part of a deal
 * - Handles item removal from cart
 * - Calculates and displays tax and total
 */

import { useCart } from "@/hooks/useCart";
import { ingredients } from "@/data/ingredients";

interface CartItemProps {
  item: any; // TODO: Type this properly with CartItem type
}

/**
 * CartItem component displays individual items in the cart
 * with their details, prices, and removal option
 */
export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  /**
   * Renders the list of ingredients for custom pizzas
   * @returns JSX element with ingredient list or null
   */
  const renderCustomPizzaDetails = () => {
    if (item.id === 'custom-pizza' && item.selectedIngredients) {
      const selectedIngredientNames = item.selectedIngredients
        .map((id: string) => ingredients[id]?.name)
        .filter(Boolean);

      return (
        <div className="text-sm text-gray-600 ml-4">
          <ul className="list-disc">
            {selectedIngredientNames.map((name: string, index: number) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

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
          {renderCustomPizzaDetails()}
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
