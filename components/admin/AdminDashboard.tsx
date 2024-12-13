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
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Control Panel</h2>
        <Tabs defaultValue="pizzas">
          <TabsList>
            <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
            <TabsTrigger value="sides">Sides</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
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