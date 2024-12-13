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
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EditDrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
  item: any;
}

export function EditDrinkModal({ isOpen, onClose, onSuccess, item }: EditDrinkModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('20 oz');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPrice(item.price?.toString() || '');
      setDescription(item.description || '');
      setSize(item.size || '20 oz');
      setImagePreview(item.image || '');
    }
  }, [item]);

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
      let imageUrl = item.image;

      if (image) {
        const storageRef = ref(storage, `drinks/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const updatedData = {
        name,
        price: parseFloat(price),
        description,
        size,
        image: imageUrl,
        updatedAt: new Date()
      };
      
      onSuccess(updatedData);
    } catch (error) {
      toast.error('Failed to update drink');
      console.error('Error updating drink:', error);
    }
  };

  return (
    <AdminModal title="Edit Drink" isOpen={isOpen} onClose={onClose}>
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
          />
        </div>
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
            <SelectItem value="20 oz">20 oz</SelectItem>
            <SelectItem value="2 Liter">2 Liter</SelectItem>
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