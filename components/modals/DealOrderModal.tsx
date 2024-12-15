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
    drinks: { id: string; name: string; price: number; }[];
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
        // Fetch all necessary menu items
        const pizzasSnap = await getDocs(collection(db, 'pizzas'));
        const pizzas = pizzasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const sidesSnap = await getDocs(collection(db, 'sides'));
        const sides = sidesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const drinksSnap = await getDocs(collection(db, 'drinks'));
        const drinks = drinksSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as { id: string; name: string; price: number; }));

        setMenuItems({ pizzas, sides, drinks });

        // Pre-select items based on deal type
        if (deal.id === "family-feast") {
          const defaultDrink = drinks.find(drink => drink.name.includes('2 Liter'));
          if (defaultDrink) {
            setSelectedOptions(prev => ({
              ...prev,
              drinks: [defaultDrink.id]
            }));
          }
        } else if (deal.id === "weekday-lunch") {
          const defaultDrink = drinks.find(drink => drink.name.includes('20 oz'));
          if (defaultDrink) {
            setSelectedOptions(prev => ({
              ...prev,
              drinks: [defaultDrink.id]
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [deal.id]);

  const isDealValid = () => {
    switch (deal.id) {
      case "christmas-special":
        return selectedOptions.pizzas.length === 2;
      case "family-feast":
        return selectedOptions.pizzas.length === 2 && 
               selectedOptions.sides.length === 2 && 
               selectedOptions.drinks.length === 1;
      case "student-special":
        return selectedOptions.pizzas.length === 1;
      case "weekday-lunch":
        return selectedOptions.pizzas.length === 1 && 
               selectedOptions.drinks.length === 1;
      case "late-night":
        return selectedOptions.pizzas.length > 0;
      default:
        return false;
    }
  };

  const calculateDealPrice = () => {
    let basePrice = deal.price;
    
    switch (deal.id) {
      case "christmas-special": {
        const selectedPizzaPrices = selectedOptions.pizzas.map(pizzaId => {
          const pizza = menuItems.pizzas.find(p => p.id === pizzaId);
          return pizza ? pizza.price : 0;
        });
        basePrice = Math.max(...selectedPizzaPrices);
        break;
      }
      case "student-special": {
        const pizza = menuItems.pizzas.find(p => p.id === selectedOptions.pizzas[0]);
        basePrice = pizza ? pizza.price * 0.5 : deal.price;
        break;
      }
      case "late-night": {
        const pizza = menuItems.pizzas.find(p => p.id === selectedOptions.pizzas[0]);
        basePrice = pizza ? pizza.price * 0.7 : deal.price;
        break;
      }
    }

    const tax = basePrice * 0.13;
    return {
      basePrice,
      tax,
      total: basePrice + tax
    };
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
    >
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
              </div>
            ) : (
              <div className="vh-full overflow-y-auto">
                {deal.id === "family-feast" && (
                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select 2 Pizzas:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {menuItems.pizzas.map((pizza) => (
                            <div 
                              key={pizza.id}
                              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
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
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-4 h-4 border rounded-sm ${
                                  selectedOptions.pizzas.includes(pizza.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                                }`} />
                                <span>{pizza.name}</span>
                              </div>
                              <span>${pizza.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select 2 Sides:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {menuItems.sides.map((side) => (
                            <div 
                              key={side.id}
                              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                if (selectedOptions.sides.includes(side.id)) {
                                  setSelectedOptions(prev => ({
                                    ...prev,
                                    sides: prev.sides.filter(id => id !== side.id)
                                  }));
                                } else if (selectedOptions.sides.length < 2) {
                                  setSelectedOptions(prev => ({
                                    ...prev,
                                    sides: [...prev.sides, side.id]
                                  }));
                                }
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-4 h-4 border rounded-sm ${
                                  selectedOptions.sides.includes(side.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                                }`} />
                                <span>{side.name}</span>
                              </div>
                              <span>${side.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select 2L Drink:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {menuItems.drinks
                            .filter(drink => drink.name.includes('2 Liter'))
                            .map((drink) => (
                              <div 
                                key={drink.id}
                                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  if (selectedOptions.drinks.includes(drink.id)) {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      drinks: prev.drinks.filter(id => id !== drink.id)
                                    }));
                                  } else {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      drinks: [drink.id]
                                    }));
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 border rounded-sm ${
                                    selectedOptions.drinks.includes(drink.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                                  }`} />
                                  <span>{drink.name}</span>
                                </div>
                                <span>${drink.price}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {deal.id === "christmas-special" && (
                  <div className="space-y-2">
                    <p className="font-semibold">Select 2 Pizzas (Second one FREE!):</p>
                    <div className="grid grid-cols-1 gap-2">
                      {menuItems.pizzas.map((pizza) => (
                        <div 
                          key={pizza.id}
                          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
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
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 border rounded-sm ${
                              selectedOptions.pizzas.includes(pizza.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                            }`} />
                            <span>{pizza.name}</span>
                          </div>
                          <span>${pizza.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {deal.id === "student-special" && (
                  <div className="space-y-2">
                    <p className="font-semibold">Select a Medium Pizza (50% off):</p>
                    {/* Medium pizza selection */}
                  </div>
                )}

                {deal.id === "weekday-lunch" && (
                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select Pizza:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {menuItems.pizzas
                            .filter(pizza => pizza.name.toLowerCase().includes('cheese pizza'))
                            .map((pizza) => (
                              <div 
                                key={pizza.id}
                                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  if (selectedOptions.pizzas.includes(pizza.id)) {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      pizzas: []
                                    }));
                                  } else {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      pizzas: [pizza.id]
                                    }));
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 border rounded-sm ${
                                    selectedOptions.pizzas.includes(pizza.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                                  }`} />
                                  <span>{pizza.name}</span>
                                </div>
                                <span>${pizza.price}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select 20oz Drink:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {menuItems.drinks
                            .filter(drink => drink.name.includes('20 oz'))
                            .map((drink) => (
                              <div 
                                key={drink.id}
                                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  if (selectedOptions.drinks.includes(drink.id)) {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      drinks: []
                                    }));
                                  } else {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      drinks: [drink.id]
                                    }));
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 border rounded-sm ${
                                    selectedOptions.drinks.includes(drink.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'
                                  }`} />
                                  <span>{drink.name}</span>
                                </div>
                                <span>${drink.price}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 