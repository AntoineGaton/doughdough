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
  const { addToCart, items, removeItem } = useCart();

  const getItemQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    return item?.quantity || 0;
  };

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
    addToCart({
      ...pizza,
      tax: pizza.price * 0.13, // 13% tax
      total: pizza.price * 1.13, // price + tax
      isDeal: false
    });
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
                className="group bg-white rounded-lg shadow-md overflow-hidden hover-scale flex flex-col h-full"
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
                  {getItemQuantity(pizza.id) > 0 && (
                    <div 
                      onClick={() => removeItem(pizza.id)}
                      className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
                    >
                      <span className="hover:hidden">{getItemQuantity(pizza.id)}</span>
                      <span className="hidden hover:block">-</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 text-sm">{pizza.description}</p>
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handlePizzaClick(pizza)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      {getItemQuantity(pizza.id) > 0 ? (
                        <>
                          Add Another
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
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