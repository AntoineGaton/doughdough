import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      itemCount: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              itemCount: state.itemCount + 1,
            };
          }
          return {
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
                  ? { ...i, quantity: i.quantity - 1 }
                  : i
              )
              .filter((i) => i.quantity > 0),
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