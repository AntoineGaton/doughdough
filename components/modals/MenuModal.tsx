import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Pizza } from "@/data/pizzas";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPizzas = async () => {
      const pizzasCollection = collection(db, 'pizzas');
      const pizzasSnapshot = await getDocs(pizzasCollection);
      
      // Fetch pizzas and their images
      const pizzasData = await Promise.all(
        pizzasSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          // Create a reference to the image in Firebase Storage
          const imageRef = ref(storage, `pizzas/${doc.id}.jpg`);
          try {
            // Get the download URL for the image
            const imageUrl = await getDownloadURL(imageRef);
            return {
              ...data,
              id: doc.id,
              image: imageUrl
            } as Pizza;
          } catch (error) {
            console.error(`Error loading image for ${doc.id}:`, error);
            // Use a fallback image if the pizza image isn't found
            return {
              ...data,
              id: doc.id,
              image: '/fallback-pizza.jpg'
            } as Pizza;
          }
        })
      );
      
      setPizzas(pizzasData);
    };

    if (isOpen) {
      fetchPizzas();
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {pizzas.map((pizza) => (
                <Card key={pizza.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={pizza.image.toString()}
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
          </TabsContent>
          <TabsContent value="sides">
            <div className="text-center py-8 text-gray-500">
              Coming Soon
            </div>
          </TabsContent>
          <TabsContent value="drinks">
            <div className="text-center py-8 text-gray-500">
              Coming Soon
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 