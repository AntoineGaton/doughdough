"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddDrinkModal } from './AddDrinkModal';
import { EditDrinkModal } from './EditDrinkModal';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'size', label: 'Size' },
];

export function DrinksManager() {
  return (
    <BaseItemManager
      collectionName="drinks"
      AddModal={AddDrinkModal}
      EditModal={EditDrinkModal}
      columns={columns}
    />
  );
} 