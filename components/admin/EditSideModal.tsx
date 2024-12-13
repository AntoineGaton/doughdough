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

interface EditSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export function EditSideModal({ isOpen, onClose, onSuccess, item }: EditSideModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('appetizer');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPrice(item.price?.toString() || '');
      setDescription(item.description || '');
      setCategory(item.category || 'appetizer');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sideRef = doc(db, 'sides', item.id);
      await updateDoc(sideRef, {
        name,
        price: parseFloat(price),
        description,
        category,
        updatedAt: new Date()
      });
      toast.success('Side item updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update side item');
      console.error('Error updating side:', error);
    }
  };

  return (
    <AdminModal title="Edit Side Item" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Side Name" 
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
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appetizer">Appetizer</SelectItem>
            <SelectItem value="salad">Salad</SelectItem>
            <SelectItem value="bread">Bread</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
        <Textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Button type="submit" className="w-full">Update Side</Button>
      </form>
    </AdminModal>
  );
} 