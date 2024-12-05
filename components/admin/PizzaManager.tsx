"use client";

import { useState } from 'react';
import { AddPizzaModal } from './AddPizzaModal';
import { Button } from '@/components/ui/button';

export function PizzaManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // ... existing code ...

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Pizzas</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Pizza</Button>
      </div>
      
      {/* Existing pizza list */}
      
      <AddPizzaModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Refresh pizza list
        }}
      />
    </div>
  );
} 