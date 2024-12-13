"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddSideModal } from './AddSideModal';
import { EditSideModal } from './EditSideModal';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
];

export function SidesManager() {
  return (
    <BaseItemManager
      collectionName="sides"
      AddModal={AddSideModal}
      EditModal={EditSideModal}
      columns={columns}
    />
  );
} 