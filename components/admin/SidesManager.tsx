"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddSideModal } from './AddSideModal';
import { EditSideModal } from './EditSideModal';
import { Side } from '@/types';

const columns: { key: keyof Side; label: string }[] = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
];

export function SidesManager() {
  return (
    <BaseItemManager<Side>
      collectionName="sides"
      AddModal={AddSideModal}
      EditModal={EditSideModal}
      columns={columns}
    />
  );
} 