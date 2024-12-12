import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Pizza } from "@/data/pizzas";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Drink } from "../../data/drinks";
import { Side } from "../../data/sides";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [sides, setSides] = useState<Side[]>([]);
  const [loading, setLoading] = useState({
    pizzas: false,
    drinks: false,
    sides: false
  });
  const { addToCart } = useCart();

  const fetchItems = async (collectionName: 'pizzas' | 'drinks' | 'sides') => {
    if (!isOpen) return;
    
    setLoading(prev => ({ ...prev, [collectionName]: true }));
    try {
      const itemsCollection = collection(db, collectionName);
      const itemsQuery = query(itemsCollection, orderBy('name'));
      
      console.log(`Attempting to fetch ${collectionName}`);
      
      const itemsSnapshot = await getDocs(itemsQuery);
      
      console.log(`${collectionName} snapshot:`, itemsSnapshot.docs);
      
      const itemsData = await Promise.all(
        itemsSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          console.log(`${collectionName} item data:`, data);
          
          return {
            ...data,
            id: doc.id,
          };
        })
      );

      switch (collectionName) {
        case 'pizzas':
          setPizzas(itemsData as Pizza[]);
          break;
        case 'drinks':
          setDrinks(itemsData as Drink[]);
          break;
        case 'sides':
          setSides(itemsData as Side[]);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      toast.error(`Failed to load ${collectionName}`);
    } finally {
      setLoading(prev => ({ ...prev, [collectionName]: false }));
    }
  };

  useEffect(() => {
    fetchItems('pizzas');
    fetchItems('drinks');
    fetchItems('sides');
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Our Menu</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="pizzas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
            <TabsTrigger value="sides">Sides</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
          </TabsList>
          <TabsContent value="pizzas">
            {loading.pizzas ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {pizzas.map((pizza) => (
                  <Card key={pizza.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={pizza.image?.toString() || '/fallback-pizza.jpg'}
                        alt={pizza.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white text-primary">
                        ${pizza.price}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{pizza.name}</CardTitle>
                      <CardDescription>{pizza.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => {
                          addToCart(pizza);
                          toast.success(`Added ${pizza.name} to cart`);
                          onClose();
                        }}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="sides">
            {loading.sides ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {sides.map((side) => (
                  <Card key={side.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={side.image?.toString() || '/fallback-side.jpg'}
                        alt={side.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white text-primary">
                        ${side.price}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{side.name}</CardTitle>
                      <CardDescription>{side.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => {
                          addToCart(side);
                          toast.success(`Added ${side.name} to cart`);
                          onClose();
                        }}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="drinks">
            {loading.drinks ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {drinks.map((drink) => (
                  <Card key={drink.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={drink.image?.toString() || '/fallback-drink.jpg'}
                        alt={drink.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white text-primary">
                        ${drink.price}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{drink.name}</CardTitle>
                      <CardDescription>{drink.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => {
                          addToCart(drink);
                          toast.success(`Added ${drink.name} to cart`);
                          onClose();
                        }}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 