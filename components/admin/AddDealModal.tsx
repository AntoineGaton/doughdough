"use client";

import { useState } from 'react';
import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';

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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error('Please select an image');
        return;
      }

      const storageRef = ref(storage, `deals/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'deals'), {
        title,
        description,
        discount,
        price: parseFloat(price),
        terms,
        isActive,
        featured,
        imageUrl,
        validityRules: {
          type: 'always'
        },
        createdAt: new Date()
      });
      
      toast.success('Deal added successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal');
    }
  };

  return (
    <AdminModal title="Add New Deal" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded mx-auto"
            />
          )}
          <Input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <Input 
          placeholder="Deal Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
        />
        <Input 
          placeholder="Discount (e.g., 20% or BOGO)" 
          value={discount} 
          onChange={(e) => setDiscount(e.target.value)} 
          required
        />
        <Input 
          placeholder="Price" 
          type="number" 
          step="0.01" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required
        />
        <Textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
        <Textarea 
          placeholder="Terms and Conditions" 
          value={terms} 
          onChange={(e) => setTerms(e.target.value)} 
          required
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