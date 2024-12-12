import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Deal } from "../../data/deals";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching deals...');
        const dealsCollection = collection(db, 'deals');
        const dealsSnapshot = await getDocs(dealsCollection);
        
        console.log('Raw deals data:', dealsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const dealsData = dealsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Deal[];

        console.log('Processed deals:', dealsData);
        setDeals(dealsData);
      } catch (err) {
        console.error('Detailed error:', err);
        setError('Failed to load deals. Please try again later.');
      } finally {
        setLoading(false);
      }
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
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        {!loading && !error && deals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active deals at the moment.
          </div>
        )}

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
                {deal.featured && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500">
                    Featured
                  </Badge>
                )}
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
                <p className="text-xs text-gray-500 mt-2">{deal.terms}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 