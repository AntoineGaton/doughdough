"use client";

import { useState } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AddPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPizzaModal({ isOpen, onClose, onSuccess }: AddPizzaModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'pizzas'), {
      name,
      price,
      description,
      isPopular: false,
      ingredients: []
    });
    onSuccess();
    onClose();
  };

  return (
    <AdminModal title="Add New Pizza" isOpen={isOpen} onClose={onClose}>
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
        <Button type="submit" className="w-full">Add Pizza</Button>
      </form>
    </AdminModal>
  );
} 