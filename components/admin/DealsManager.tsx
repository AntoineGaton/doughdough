"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddDealModal } from './AddDealModal';
import { EditDealModal } from './EditDealModal';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'discount', label: 'Discount' },
  { key: 'price', label: 'Price' },
  { key: 'isActive', label: 'Active' },
  { key: 'featured', label: 'Featured' },
];

export function DealsManager() {
  return (
    <BaseItemManager
      collectionName="deals"
      AddModal={AddDealModal}
      EditModal={EditDealModal}
      columns={columns}
    />
  );
} 