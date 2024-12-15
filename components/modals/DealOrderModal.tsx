"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    discount?: string;
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
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [schoolSearch, setSchoolSearch] = useState<string>("");

  const schools = [
    // Alabama
    "University of Alabama",
    "Hoover High School",
    // Alaska
    "University of Alaska Fairbanks",
    "West Anchorage High School",
    // Arizona
    "Arizona State University",
    "Phoenix Union High School",
    // Arkansas
    "University of Arkansas",
    "Little Rock Central High School",
    // California
    "University of California, Berkeley",
    "Los Angeles High School",
    // Colorado
    "Colorado Technical University",
    "Denver East High School",
    // Connecticut
    "Yale University",
    "Greenwich High School",
    // Delaware
    "University of Delaware",
    "Caesar Rodney High School",
    // Florida
    "University of Florida",
    "Miami Senior High School",
    // Georgia
    "University of Georgia",
    "Grady High School",
    // Hawaii
    "University of Hawaii at Manoa",
    "Punahou School",
    // Idaho
    "University of Idaho",
    "Boise High School",
    // Illinois
    "University of Illinois Urbana-Champaign",
    "New Trier High School",
    // Indiana
    "Indiana University Bloomington",
    "Carmel High School",
    // Iowa
    "University of Iowa",
    "Des Moines Central Campus High School",
    // Kansas
    "University of Kansas",
    "Wichita East High School",
    // Kentucky
    "University of Kentucky",
    "DuPont Manual High School",
    // Louisiana
    "Louisiana State University",
    "Benjamin Franklin High School",
    // Maine
    "University of Maine",
    "Portland High School",
    // Maryland
    "University of Maryland, College Park",
    "Montgomery Blair High School",
    // Massachusetts
    "Harvard University",
    "Boston Latin School",
    // Michigan
    "University of Michigan",
    "Cass Technical High School",
    // Minnesota
    "University of Minnesota",
    "Edina High School",
    // Mississippi
    "University of Mississippi (Ole Miss)",
    "Oxford High School",
    // Missouri
    "University of Missouri",
    "Kirkwood High School",
    // Montana
    "University of Montana",
    "Hellgate High School",
    // Nebraska
    "University of Nebraska-Lincoln",
    "Omaha Central High School",
    // Nevada
    "University of Nevada, Las Vegas (UNLV)",
    "Clark High School",
    // New Hampshire
    "University of New Hampshire",
    "Pinkerton Academy",
    // New Jersey
    "Princeton University",
    "Bergen County Academies",
    // New Mexico
    "University of New Mexico",
    "Albuquerque Academy",
    // New York
    "New York University",
    "Mount Saint Michael Academy",
    // North Carolina
    "University of North Carolina at Chapel Hill",
    "Myers Park High School",
    // North Dakota
    "University of North Dakota",
    "Fargo South High School",
    // Ohio
    "Ohio State University",
    "Shaker Heights High School",
    // Oklahoma
    "University of Oklahoma",
    "Edmond Memorial High School",
    // Oregon
    "University of Oregon",
    "Grant High School",
    // Pennsylvania
    "University of Pennsylvania",
    "Northampton Community College",
    "Pleasant Valley High School",
    // Rhode Island
    "Brown University",
    "Barrington High School",
    // South Carolina
    "University of South Carolina",
    "Wando High School",
    // South Dakota
    "University of South Dakota",
    "Washington High School",
    // Tennessee
    "University of Tennessee",
    "White Station High School",
    // Texas
    "University of Texas at Austin",
    "Westlake High School",
    // Utah
    "University of Utah",
    "Brighton High School",
    // Vermont
    "University of Vermont",
    "Burlington High School",
    // Virginia
    "University of Virginia",
    "Thomas Jefferson High School for Science and Technology",
    // Washington
    "University of Washington",
    "Garfield High School",
    // West Virginia
    "West Virginia University",
    "Morgantown High School",
    // Wisconsin
    "University of Wisconsin-Madison",
    "Brookfield Central High School",
    // Wyoming
    "University of Wyoming",
    "Natrona County High School"
];

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
        return selectedOptions.pizzas.length === 1 && selectedSchool !== "";
      case "weekday-lunch":
        return selectedOptions.pizzas.length === 1 && 
               selectedOptions.drinks.length === 1;
      case "late-night":
        return selectedOptions.pizzas.length > 0 && isValidLateNightTime();
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

  const isValidLateNightTime = () => {
    const now = new Date();
    const hour = now.getHours();
    // Valid between 22:00 (10 PM) and 02:00 (2 AM)
    return hour >= 22 || hour < 2;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{deal.title}</DialogTitle>
        </DialogHeader>

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
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select Pizza (50% off):</p>
                      <div className="grid grid-cols-1 gap-2">
                        {menuItems.pizzas
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
                              <div className="flex flex-col items-end">
                                <span className="text-gray-500 line-through">${Number(pizza.price).toFixed(2)}</span>
                                <span>${(Number(pizza.price) * 0.5).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select School:</p>
                      <div className="relative">
                        {selectedSchool ? (
                          <div className="w-full p-2 border rounded-md flex justify-between items-center">
                            <span>{selectedSchool}</span>
                            <X 
                              className="h-4 w-4 cursor-pointer hover:text-red-600" 
                              onClick={() => {
                                setSelectedSchool("");
                                setSchoolSearch("");
                              }}
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Search for your school..."
                            value={schoolSearch}
                            onChange={(e) => setSchoolSearch(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        )}
                        {!selectedSchool && schoolSearch && (
                          <div className="absolute w-full mt-1 max-h-48 overflow-y-auto bg-white border rounded-md shadow-lg z-20">
                            {schools
                              .filter(school => 
                                school.toLowerCase().includes(schoolSearch.toLowerCase())
                              )
                              .map(school => (
                                <div
                                  key={school}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                    selectedSchool === school ? 'bg-red-50' : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedSchool(school);
                                    setSchoolSearch("");
                                  }}
                                >
                                  {school}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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

              {deal.id === "late-night" && (
                <div className="max-h-[40vh] overflow-y-auto pr-2">
                  {!isValidLateNightTime() ? (
                    <div className="text-red-500 p-4 text-center">
                      This deal is only available between 10 PM and 2 AM
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold sticky top-0 bg-white py-2 z-10">Select Pizza (30% off):</p>
                      <div className="grid grid-cols-1 gap-2">
                        {menuItems.pizzas.map((pizza) => (
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
                            <div className="flex flex-col items-end">
                              <span className="text-gray-500 line-through">${Number(pizza.price).toFixed(2)}</span>
                              <span>${(Number(pizza.price) * 0.7).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                className={`mt-4 w-full ${
                  (!isDealValid() || (deal.id === "late-night" && !isValidLateNightTime())) 
                  ? 'opacity-50 cursor-not-allowed mt-4' 
                  : ''
                }`}
                style={{
                  display: (deal.id === "late-night" && !isValidLateNightTime()) 
                    ? 'none' 
                    : 'block'
                }}
              >
                Add to Cart - ${calculateDealPrice().total.toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 