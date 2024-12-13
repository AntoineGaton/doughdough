"use client";

import { useState, useEffect } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface EditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export function EditDealModal({ isOpen, onClose, onSuccess, item }: EditDealModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [terms, setTerms] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setDiscount(item.discount || '');
      setPrice(item.price?.toString() || '');
      setTerms(item.terms || '');
      setIsActive(item.isActive ?? true);
      setFeatured(item.featured ?? false);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dealRef = doc(db, 'deals', item.id);
      await updateDoc(dealRef, {
        title,
        description,
        discount,
        price: parseFloat(price),
        terms,
        isActive,
        featured,
        updatedAt: new Date()
      });
      toast.success('Deal updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update deal');
      console.error('Error updating deal:', error);
    }
  };

  return (
    <AdminModal title="Edit Deal" isOpen={isOpen} onClose={onClose}>
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
        <Button type="submit" className="w-full">Update Deal</Button>
      </form>
    </AdminModal>
  );
} 