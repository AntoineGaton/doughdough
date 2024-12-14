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
import { X } from 'lucide-react';

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
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

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

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions(prev => [...prev, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(prev => prev.filter((_, index) => index !== indexToRemove));
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
        options,
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
        <div className="space-y-2">
          <Label>Deal Options</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add option (e.g., 'Large Pizza')"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <Button 
              type="button"
              onClick={handleAddOption}
              variant="secondary"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{option}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
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