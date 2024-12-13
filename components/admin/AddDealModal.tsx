"use client";

import { useState } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDealModal({ isOpen, onClose, onSuccess }: AddDealModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [terms, setTerms] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'deals'), {
      title,
      description,
      discount,
      price: parseFloat(price),
      terms,
      isActive,
      featured,
      validityRules: {
        type: 'always'
      },
      createdAt: new Date()
    });
    onSuccess();
    onClose();
  };

  return (
    <AdminModal title="Add New Deal" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Deal Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <Input 
          placeholder="Discount (e.g., 20% or BOGO)" 
          value={discount} 
          onChange={(e) => setDiscount(e.target.value)} 
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
        <Textarea 
          placeholder="Terms and Conditions" 
          value={terms} 
          onChange={(e) => setTerms(e.target.value)} 
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive} 
              id="active-status" 
            />
            <Label htmlFor="active-status">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={featured} 
              onCheckedChange={setFeatured} 
              id="featured-status" 
            />
            <Label htmlFor="featured-status">Featured</Label>
          </div>
        </div>
        <Button type="submit" className="w-full">Add Deal</Button>
      </form>
    </AdminModal>
  );
} 