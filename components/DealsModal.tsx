import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Deal } from "../data/deals";
import { deals } from "../data/deals";

interface DealsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealsModal({ isOpen, onClose }: DealsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">All Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {deals.map((deal: Deal) => (
            <div 
              key={deal.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full">
                  ${deal.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600">{deal.description}</p>
                <button className="mt-4 flex items-center text-red-600 font-semibold">
                  Order Now <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}