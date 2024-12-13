"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddDrinkModal } from './AddDrinkModal';
import { EditDrinkModal } from './EditDrinkModal';
import { Drink } from '@/types';

const columns: { key: keyof Drink; label: string }[] = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'size', label: 'Size' },
];

export function DrinksManager() {
  return (
    <BaseItemManager<Drink>
      collectionName="drinks"
      AddModal={AddDrinkModal}
      EditModal={EditDrinkModal}
      columns={columns}
    />
  );
} 