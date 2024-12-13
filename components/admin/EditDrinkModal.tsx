"use client";

import { useState, useEffect } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface EditDrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export function EditDrinkModal({ isOpen, onClose, onSuccess, item }: EditDrinkModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('regular');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPrice(item.price?.toString() || '');
      setDescription(item.description || '');
      setSize(item.size || 'regular');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const drinkRef = doc(db, 'drinks', item.id);
      await updateDoc(drinkRef, {
        name,
        price: parseFloat(price),
        description,
        size,
        updatedAt: new Date()
      });
      toast.success('Drink updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update drink');
      console.error('Error updating drink:', error);
    }
  };

  return (
    <AdminModal title="Edit Drink" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Drink Name" 
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
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
        <Textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Button type="submit" className="w-full">Update Drink</Button>
      </form>
    </AdminModal>
  );
} 