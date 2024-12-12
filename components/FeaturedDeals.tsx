"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { DealsModal } from "./modals/DealsModal";
import { DealOrderModal } from "./modals/DealOrderModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Deal = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  options: string[];
  terms: string;
  isActive: boolean;
  featured: boolean;
  discount?: string;
}

export function FeaturedDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDealsModalOpen, setIsDealsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const dealsRef = collection(db, 'deals');
        const q = query(dealsRef, where('featured', '==', true), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        
        const dealsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Deal[];
        
        setDeals(dealsData);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleOrderNow = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured</h2>
        <button 
          onClick={() => setIsDealsModalOpen(true)}
          className="text-red-600 hover:text-red-700 font-semibold flex items-center"
        >
          SEE MORE <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {deals.map((deal) => (
          <div 
            key={deal.id}
            className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                className="object-cover"
              />
              {deal.discount && (
                <div className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full font-bold">
                  {deal.discount}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h3>
              <p className="text-gray-600">{deal.description}</p>
              <button 
                onClick={() => handleOrderNow(deal)}
                className="mt-4 flex items-center text-red-600 font-semibold"
              >
                Order Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <DealsModal 
        isOpen={isDealsModalOpen} 
        onClose={() => setIsDealsModalOpen(false)} 
      />
      
      {selectedDeal && (
        <DealOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          deal={selectedDeal}
        />
      )}
    </section>
  );
}