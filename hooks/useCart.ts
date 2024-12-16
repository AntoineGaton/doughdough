/**
 * @fileoverview Cart management hook using Zustand for state management
 * 
 * Dependencies:
 * - zustand: State management
 * - @/data/pizzas: Pizza type definitions
 * - @/data/drinks: Drink type definitions
 * - @/data/sides: Side type definitions
 * - @/lib/firebase: Firebase authentication
 * 
 * Upstream:
 * - Used by components/cart/CartItem.tsx
 * - Used by components/CheckoutButton.tsx
 * - Used by components/NavBar.tsx
 * 
 * Downstream:
 * - Persists to localStorage via zustand/middleware/persist
 * - Interacts with Firebase Authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pizza } from '@/data/pizzas';
import { Drink } from '@/data/drinks';
import { Side } from '@/data/sides';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Interface defining the cart's state and methods
 */
interface CartState {
  items: CartItem[];
  itemCount: number;
  deliveryMethod: 'pickup' | 'delivery';
  setDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

/**
 * Type definition for items that can be added to cart
 * Includes pizzas, drinks, sides, and deals
 */
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

/**
 * Custom hook for cart management using Zustand
 * Handles cart state, persistence, and authentication sync
 * 
 * @returns CartState object with cart data and methods
 */
export const useCart = create<CartState>()(
  persist(
    (set) => {
      /**
       * Subscribe to authentication state changes
       * Clears cart when user logs out
       */
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          set({ items: [], itemCount: 0 });
        }
      });

      return {
        items: [],
        itemCount: 0,
        deliveryMethod: 'pickup' as 'pickup' | 'delivery',
        
        /**
         * Sets the delivery method for the order
         * @param method - 'pickup' or 'delivery'
         */
        setDeliveryMethod: (method: 'pickup' | 'delivery') => set({ deliveryMethod: method }),
        
        /**
         * Adds an item to the cart with tax calculation
         * @param item - The item to add
         */
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
        
        /**
         * Removes a single quantity of an item
         * @param itemId - ID of the item to remove
         */
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
        
        /**
         * Clears all items from the cart
         */
        clearCart: () => set({ items: [], itemCount: 0 }),
        
        /**
         * Removes all quantities of an item from the cart
         * @param itemId - ID of the item to remove
         */
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