import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: OrderDetails) => void;
}

export type OrderDetails = {
  name: string;
  phone: string;
  address?: string;
}

export function OrderDetailsModal({ isOpen, onClose, onSubmit }: OrderDetailsModalProps) {
  const { deliveryMethod } = useCart();
  const [details, setDetails] = useState<OrderDetails>({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-secondary">
            {deliveryMethod === 'delivery' ? '🚗 Delivery Details' : '🏪 Pickup Details'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={details.name}
              onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              required
              type="tel"
              value={details.phone}
              onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
              className="mt-1"
            />
          </div>

          {deliveryMethod === 'delivery' && (
            <div>
              <label className="text-sm font-medium">Delivery Address</label>
              <Input
                required
                value={details.address}
                onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your delivery address"
                className="mt-1"
              />
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90 text-white"
          >
            Continue to Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 