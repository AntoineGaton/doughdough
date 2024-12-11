"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { Pizza } from "@/data/pizzas";
import { MenuModal } from "@/components/modals/MenuModal";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/hooks/useCart";

export function PopularPizzas() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const fetchPopularPizzas = async () => {
      try {
        const pizzasCollection = collection(db, 'pizzas');
        const pizzasQuery = query(
          pizzasCollection,
          where('isPopular', '==', true),
          orderBy('name'),
          limit(8)
        );
        const pizzasSnapshot = await getDocs(pizzasQuery);
        const pizzasData = pizzasSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Pizza[];
        
        if (mounted) {
          setPizzas(pizzasData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching popular pizzas:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPopularPizzas();
    return () => { mounted = false };
  }, []);

  const handlePizzaClick = (pizza: Pizza) => {
    addToCart(pizza);
  };

  return (
    <section className="py-12">
      <div className="border-t-2 border-b-2 border-red-600 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Popular Pizzas</h2>
          <button 
            onClick={() => setIsMenuModalOpen(true)}
            className="text-red-600 hover:text-red-700 font-semibold flex items-center"
          >
            PIZZA MENU <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {pizzas.map((pizza) => (
              <div
                key={pizza.id}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover-scale cursor-pointer"
                onClick={() => handlePizzaClick(pizza)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={pizza.image?.toString() || '/fallback-pizza.jpg'}
                    alt={pizza.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full font-bold">
                    ${pizza.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 text-sm">{pizza.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
    </section>
  );
}