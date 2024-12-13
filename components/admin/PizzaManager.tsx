"use client";

import { BaseItemManager } from './BaseItemManager';
import { AddPizzaModal } from './AddPizzaModal';
import { EditPizzaModal } from './EditPizzaModal';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'isPopular', label: 'Popular' },
];

export function PizzaManager() {
  return (
    <BaseItemManager
      collectionName="pizzas"
      AddModal={AddPizzaModal}
      EditModal={EditPizzaModal}
      columns={columns}
    />
  );
} 