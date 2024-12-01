export type Ingredient = {
  id: string;
  name: string;
  price: number;
  category: 'meat' | 'vegetable' | 'cheese' | 'sauce' | 'base';
  image?: string;
};

// Record<string, Ingredient> is a TypeScript utility type that creates an object type
// where all the keys are strings and all the values must match the Ingredient type
// In other words, this creates an object that acts like a dictionary/map where:
// - The keys are strings (like 'thinCrust', 'pepperoni', etc)
// - The values must all be Ingredient objects with id, name, price, etc
export const ingredients: Record<string, Ingredient> = {
  // Bases
  thinCrust: {
    id: 'thin-crust',
    name: 'Thin Crust',
    price: 11.99,
    category: 'base',
  },
  thickCrust: {
    id: 'thick-crust',
    name: 'Thick Crust',
    price: 12.99,
    category: 'base',
  },
  
  // Sauces
  tomatoSauce: {
    id: 'tomato-sauce',
    name: 'Tomato Sauce',
    price: 0.99,
    category: 'sauce',
  },
  bbqSauce: {
    id: 'bbq-sauce',
    name: 'BBQ Sauce',
    price: 1.49,
    category: 'sauce',
  },
  
  // Cheeses
  mozzarella: {
    id: 'mozzarella',
    name: 'Mozzarella',
    price: 1.99,
    category: 'cheese',
  },
  feta: {
    id: 'feta',
    name: 'Feta',
    price: 2.49,
    category: 'cheese',
  },
  
  // Meats
  pepperoni: {
    id: 'pepperoni',
    name: 'Pepperoni',
    price: 2.49,
    category: 'meat',
  },
  chicken: {
    id: 'chicken',
    name: 'Grilled Chicken',
    price: 2.99,
    category: 'meat',
  },
  
  // Vegetables
  mushrooms: {
    id: 'mushrooms',
    name: 'Mushrooms',
    price: 1.49,
    category: 'vegetable',
  },
  onions: {
    id: 'onions',
    name: 'Onions',
    price: 0.99,
    category: 'vegetable',
  }
}; 