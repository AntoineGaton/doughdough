"use client";

import { useState, useEffect } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface EditPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export function EditPizzaModal({ isOpen, onClose, onSuccess, item }: EditPizzaModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPrice(item.price?.toString() || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pizzaRef = doc(db, 'pizzas', item.id);
      await updateDoc(pizzaRef, {
        name,
        price: parseFloat(price),
        description,
        updatedAt: new Date()
      });
      toast.success('Pizza updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update pizza');
      console.error('Error updating pizza:', error);
    }
  };

  return (
    <AdminModal title="Edit Pizza" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Pizza Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <Input 
          placeholder="Price" 
          type="number" 
          step="0.01" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
        <Textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Button type="submit" className="w-full">Update Pizza</Button>
      </form>
    </AdminModal>
  );
} 