export interface BaseItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Side extends BaseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Drink extends BaseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  size: string;
  category: string;
}

export interface Deal extends BaseItem {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  discount: string;
  terms: string;
  price: number;
  isActive: boolean;
  featured: boolean;
  validityRules: {
    type: 'date' | 'time' | 'always' | 'weekday';
    month?: number;
    day?: number;
    startHour?: number;
    endHour?: number;
    days?: number[];
  };
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  tax: number;
  total: number;
  description: string;
  selectedItems?: {
    pizzas: string[];
    sides: string[];
    drinks: string[];
    school?: string;
    details: string[];
  };
  isDeal: boolean;
}; 