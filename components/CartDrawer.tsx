import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { X } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount } = useCart();

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your order</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </DrawerHeader>

          {itemCount === 0 ? (
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="Pizza Logo"
                  width={120}
                  height={120}
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
                  <p className="font-medium">${item.price}</p>
                </div>
              ))}
            </div>
          )}

          <DrawerFooter>
            <button
              className="w-full bg-secondary text-white py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors"
              onClick={() => {
                onClose();
                window.location.href = '/order';
              }}
            >
              START YOUR ORDER
            </button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 