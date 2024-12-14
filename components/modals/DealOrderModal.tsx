"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDocs } from "firebase/firestore";

type DealOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deal: {
    id: string;
    title: string;
    price: number;
    options: string[];
    description: string;
    terms: string;
    discount: string;
  };
};

export function DealOrderModal({ isOpen, onClose, deal }: DealOrderModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<{
    pizzas: string[];
    sides: string[];
    drinks: string[];
  }>({
    pizzas: [],
    sides: [],
    drinks: []
  });
  const [menuItems, setMenuItems] = useState<{
    pizzas: any[];
    sides: any[];
    drinks: any[];
  }>({
    pizzas: [],
    sides: [],
    drinks: []
  });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // Fetch pizzas
        const pizzasSnap = await getDocs(collection(db, 'pizzas'));
        const pizzas = pizzasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch sides for the chocolate cake
        const sidesSnap = await getDocs(collection(db, 'sides'));
        const sides = sidesSnap.docs.map(doc => ({ 
          id: doc.id, 
          name: doc.data().name,
          ...doc.data() 
        }));

        // For Christmas deal, auto-select the chocolate cake
        if (deal.discount === "2-FOR-1") {
          const chocolateCake = sides.find(side => 
            side.name.toLowerCase().includes('chocolate')
          );
          if (chocolateCake) {
            setSelectedOptions(prev => ({
              ...prev,
              sides: [chocolateCake.id]
            }));
          }
        }

        setMenuItems({ pizzas, sides, drinks: [] });
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [deal.discount]);

  const calculateDealPrice = () => {
    if (selectedOptions.pizzas.length === 2) {
      const selectedPizzaPrices = selectedOptions.pizzas.map(pizzaId => {
        const pizza = menuItems.pizzas.find(p => p.id === pizzaId);
        return pizza ? pizza.price : 0;
      });
      const basePrice = Math.max(...selectedPizzaPrices);
      const tax = basePrice * 0.13; // 13% tax
      return {
        basePrice,
        tax,
        total: basePrice + tax
      };
    }
    return {
      basePrice: deal.price,
      tax: deal.price * 0.13,
      total: deal.price * 1.13
    };
  };

  const isDealValid = () => {
    switch (deal.discount) {
      case "2-FOR-1":
        return selectedOptions.pizzas.length === 2;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              {deal.title}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{deal.description}</p>
            
            <div className="text-sm text-red-600 italic">
              {deal.terms}
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <>
                {deal.discount === "2-FOR-1" && (
                  <>
                    <div className="space-y-2">
                      <p className="font-semibold">Select 2 Pizzas:</p>
                      {menuItems.pizzas.map((pizza) => (
                        <label key={pizza.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedOptions.pizzas.includes(pizza.id)}
                            onChange={() => {
                              if (selectedOptions.pizzas.includes(pizza.id)) {
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  pizzas: prev.pizzas.filter(id => id !== pizza.id)
                                }));
                              } else if (selectedOptions.pizzas.length < 2) {
                                setSelectedOptions(prev => ({
                                  ...prev,
                                  pizzas: [...prev.pizzas, pizza.id]
                                }));
                              }
                            }}
                            disabled={selectedOptions.pizzas.length >= 2 && !selectedOptions.pizzas.includes(pizza.id)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span>{pizza.name}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-2 bg-gray-50 p-3 rounded">
                      <p className="font-semibold">Included in deal:</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled={true}
                          className="rounded border-blue-600 text-blue-600 focus:ring-blue-500 checked:bg-blue-600"
                        />
                        <span className="text-gray-700">Hot Lava Chocolate Cake</span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  onClick={() => {
                    if (isDealValid()) {
                      addToCart({
                        id: deal.id,
                        name: deal.title,
                        price: calculateDealPrice().basePrice,
                        tax: calculateDealPrice().tax,
                        total: calculateDealPrice().total,
                        description: deal.description,
                        selectedItems: {
                          ...selectedOptions,
                          details: selectedOptions.pizzas.map(pizzaId => {
                            const pizza = menuItems.pizzas.find(p => p.id === pizzaId);
                            return pizza?.name || '';
                          })
                        },
                        isDeal: true
                      });
                      onClose();
                      toast.success("Deal added to cart!");
                    } else {
                      toast.error("Please select all required items for this deal");
                    }
                  }}
                  disabled={!isDealValid()}
                  variant={isDealValid() ? "secondary" : "default"}
                  className={`w-full ${!isDealValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add to Cart - ${calculateDealPrice().total.toFixed(2)}
                </Button>
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 