"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddPizzaModal } from './AddPizzaModal';
import { EditPizzaModal } from './EditPizzaModal';
import { BaseItem } from '@/types';

interface Pizza extends BaseItem {
  name: string;
  price: number;
  description: string;
  image: string;
  isPopular: boolean;
}

const columns: { key: keyof Pizza; label: string }[] = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'isPopular', label: 'Popular' },
];

export function PizzaManager() {
  return (
    <BaseItemManager<Pizza>
      collectionName="pizzas"
      AddModal={AddPizzaModal}
      EditModal={EditPizzaModal}
      columns={columns}
    />
  );
} 