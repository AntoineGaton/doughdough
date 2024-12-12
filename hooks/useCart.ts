import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pizza } from '@/data/pizzas';
import { Drink } from '@/data/drinks';
import { Side } from '@/data/sides';

interface CartState {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

type CartItem = Pizza | Drink | Side;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      itemCount: 0,
      addToCart: (item) =>
        set((state) => {
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
            items: [...state.items, { ...item, quantity: 1 }],
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
    }),
    {
      name: 'cart-storage',
    }
  )
); 