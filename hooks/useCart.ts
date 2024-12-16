import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pizza } from '@/data/pizzas';
import { Drink } from '@/data/drinks';
import { Side } from '@/data/sides';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface CartState {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  tax: number;
  total: number;
  description: string;
  image?: string;
  selectedIngredients?: string[];
  selectedItems?: {
    pizzas: string[];
    sides: string[];
    drinks: string[];
    details?: string[];
  };
  isDeal?: boolean;
  quantity?: number;
};

export const useCart = create<CartState>()(
  persist(
    (set) => {
      // Subscribe to auth state changes
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          set({ items: [], itemCount: 0 });
        }
      });

      return {
        items: [],
        itemCount: 0,
        addToCart: (item) =>
          set((state) => {
            const basePrice = Number(item.price) || 0;
            const tax = Number((basePrice * 0.13).toFixed(2));
            const total = Number((basePrice + tax).toFixed(2));
            const newItem = { 
              ...item, 
              price: basePrice,
              tax: tax,
              total: total 
            };

            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
              return {
                ...state,
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
                ),
                itemCount: state.itemCount + 1,
              };
            }
            return {
              ...state,
              items: [...state.items, { ...newItem, quantity: 1 }],
              itemCount: state.itemCount + 1,
            };
          }),
        removeItem: (itemId) =>
          set((state) => {
            const item = state.items.find((i) => i.id === itemId);
            if (!item) return state;
            
            return {
              items: state.items
                .map((i) =>
                  i.id === itemId
                    ? { ...i, quantity: (i.quantity || 0) - 1 }
                    : i
                )
                .filter((i) => (i.quantity || 0) > 0),
              itemCount: state.itemCount - 1,
            };
          }),
        clearCart: () => set({ items: [], itemCount: 0 }),
        removeFromCart: (itemId) => 
          set((state) => ({
            items: state.items.filter(i => i.id !== itemId),
            itemCount: state.itemCount - (state.items.find(i => i.id === itemId)?.quantity || 1)
          })),
      };
    },
    {
      name: 'cart-storage',
    }
  )
); 