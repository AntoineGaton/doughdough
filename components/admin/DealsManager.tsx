"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddDealModal } from './AddDealModal';
import { EditDealModal } from './EditDealModal';
import { Deal } from '@/types';

const columns: { key: keyof Deal; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'discount', label: 'Discount' },
  { key: 'price', label: 'Price' },
  { key: 'isActive', label: 'Active' },
  { key: 'featured', label: 'Featured' },
];

export function DealsManager() {
  return (
    <BaseItemManager<Deal>
      collectionName="deals"
      AddModal={AddDealModal}
      EditModal={EditDealModal}
      columns={columns}
    />
  );
} 