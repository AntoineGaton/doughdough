import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { useCart } from "@/hooks/useCart";
import { VisuallyHidden } from "../components/ui/visually-hidden";
import Image from "next/image";
import { X } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, removeItem } = useCart();

  const total = items.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="min-w-[320px]">
        <div className="bg-primary max-h-[85vh] overflow-y-auto">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="w-6" />
                <div>
                  <VisuallyHidden>Shopping Cart</VisuallyHidden>
                  <h2 className="text-2xl font-bold">Your order</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close cart"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </DrawerHeader>

            {itemCount === 0 ? (
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Image
                    src="/images/logo2.png"
                    alt="Pizza Logo"
                    width={300}
                    height={300}
                    className="opacity-50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Your cart is hungry</h3>
                <p className="text-gray-500 mb-6">FILL IT WITH PIZZA!</p>
              </div>
            ) : (
              <div className="px-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-medium">${item.price}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  <CheckoutButton items={items} total={total} />
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 