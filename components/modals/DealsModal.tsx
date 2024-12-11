import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Deal } from "@/data/deals";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

interface DealsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealsModal({ isOpen, onClose }: DealsModalProps) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      const dealsCollection = collection(db, 'deals');
      const dealsSnapshot = await getDocs(dealsCollection);
      const dealsData = dealsSnapshot.docs.map(doc => doc.data() as Deal);
      setDeals(dealsData);
    };

    if (isOpen) {
      fetchDeals();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Current Deals & Promotions</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-600">
                  {deal.discount}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                {deal.validityRules.type === "date" && (
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>Valid on {deal.validityRules.month}/{deal.validityRules.day}</span>
                  </div>
                )}
                {deal.validityRules.type === "time" && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Valid {deal.validityRules.startHour}:00 - {deal.validityRules.endHour}:00</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">{deal.terms}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 