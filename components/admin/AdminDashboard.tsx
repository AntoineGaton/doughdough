"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PizzaManager } from './PizzaManager';
import { DrinksManager } from './DrinksManager';
import { SidesManager } from './SidesManager';
import { DealsManager } from './DealsManager';
import { OrdersManager } from './OrdersManager';
import { Pizza, Store, Beer, Receipt, Percent, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AdminDashboard() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => setLoading(false), 100);
    }
  }, [authLoading]);

  // Show loading state while checking admin status
  if (loading) {
    return (
      <div className="w-[600px] mx-auto space-y-8 animate-pulse">
        <div className="bg-white rounded-lg p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="w-full h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Redirect or show nothing if not admin
  if (!isAdmin) return null;

  return (
    <div className="w-[600px] mx-auto space-y-8">
      {/* Control Panel Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Control Panel</h2>
        <div className="w-full">
          <Tabs defaultValue="pizzas" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full bg-muted p-2">
              <TabsTrigger value="pizzas" className="flex items-center justify-center gap-2 w-full">
                <Pizza className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Pizzas</span>
              </TabsTrigger>
              <TabsTrigger value="drinks" className="flex items-center justify-center gap-2">
                <Beer className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Drinks</span>
              </TabsTrigger>
              <TabsTrigger value="sides" className="flex items-center justify-center gap-2">
                <Store className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Sides</span>
              </TabsTrigger>
              <TabsTrigger value="deals" className="flex items-center justify-center gap-2">
                <Percent className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Deals</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center justify-center gap-2">
                <Receipt className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Orders</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pizzas" className="min-h-[400px]">
              <PizzaManager />
            </TabsContent>
            <TabsContent value="drinks">
              <DrinksManager />
            </TabsContent>
            <TabsContent value="sides">
              <SidesManager />
            </TabsContent>
            <TabsContent value="deals">
              <DealsManager />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 