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
    console.log('Auth state:', { isAdmin, authLoading });
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  if (loading || authLoading) {
    return (
      <div className="w-[600px] mx-auto space-y-8">
        <div className="bg-white rounded-lg p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] mx-auto space-y-8">
      <div className="bg-white rounded-lg">
        <Tabs defaultValue="pizzas">
          <TabsList className="w-full">
            <TabsTrigger value="pizzas" className="flex-1">Pizzas</TabsTrigger>
            <TabsTrigger value="drinks" className="flex-1">Drinks</TabsTrigger>
            <TabsTrigger value="sides" className="flex-1">Sides</TabsTrigger>
            <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="pizzas">
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
  );
} 