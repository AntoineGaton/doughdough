import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { useCart } from "@/hooks/useCart";
import { VisuallyHidden } from "../components/ui/visually-hidden";
import Image from "next/image";
import { X } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { CartItem } from "./cart/CartItem";
import { CartSummary } from "./cart/CartSummary";
import { useState } from "react";
import { MenuModal } from "./modals/MenuModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, deliveryMethod, setDeliveryMethod } = useCart();
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const handleFillCartClick = () => {
    onClose();
    setIsMenuModalOpen(true);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="min-w-[320px]">
          <div className={`bg-primary flex flex-col max-h-[85vh] overflow-y-auto ${
            itemCount === 0 
              ? 'min-h-[40vh]' 
              : itemCount === 1 
                ? 'min-h-[30vh]'
                : items.length <= 2 
                  ? 'min-h-[40vh]' 
                  : items.length <= 3 
                    ? 'min-h-[50vh]'
                    : items.length <= 4 
                      ? 'min-h-[60vh]' 
                      : 'min-h-[70vh]'
          }`}>
            <div className="mx-auto w-full max-w-sm flex-1">
              <DrawerHeader className="flex items-center justify-between sticky top-0 bg-primary z-10">
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
                      src="/images/Doughdough/3.png"
                      alt="Pizza Logo"
                      width={300}
                      height={300}
                      className="opacity-50"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your cart is hungry</h3>
                  <p 
                    className="text-gray-500 mb-6 cursor-pointer animate-bounce hover:text-secondary transition-colors"
                    onClick={handleFillCartClick}
                  >
                    FILL IT WITH PIZZA!
                  </p>
                </div>
              ) : (
                <div className="px-6">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}

                  <div className="mt-4">
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            deliveryMethod === 'pickup' 
                              ? 'bg-white shadow-sm text-gray-900' 
                              : 'text-gray-600 hover:bg-white/50'
                          }`}
                        >
                          <span role="img" aria-label="pickup">🏪</span>
                          Pickup
                        </button>
                        <button
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            deliveryMethod === 'delivery' 
                              ? 'bg-secondary text-white' 
                              : 'text-gray-600 hover:bg-white/50'
                          }`}
                        >
                          <span role="img" aria-label="delivery">🚗</span>
                          Delivery
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 mt-4"></div>
                    <CartSummary />
                    <div className="mt-4">
                      <CheckoutButton 
                        items={items} 
                        total={items.reduce((sum, item) => 
                          sum + (item.total * (item.quantity || 1)), 
                          0
                        )} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
    </>
  );
} 