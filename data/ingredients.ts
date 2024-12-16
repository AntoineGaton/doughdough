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
  regularCrust: {
    id: 'regular-crust',
    name: 'Regular Crust',
    price: 11.99,
    category: 'base',
  },
  thinCrust: {
    id: 'thin-crust',
    name: 'Thin Crust',
    price: 10.99,
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
    price: 0.00,
    category: 'sauce',
  },
  bbqSauce: {
    id: 'bbq-sauce',
    name: 'BBQ Sauce',
    price: 1.49,
    category: 'sauce',
  },
  alfredoSauce: {
    id: 'alfredo-sauce',
    name: 'Alfredo Sauce',
    price: 1.99,
    category: 'sauce',
  },
  pestoSauce: {
    id: 'pesto-sauce',
    name: 'Pesto Sauce',
    price: 1.99,
    category: 'sauce',
  },
  
  // Cheeses
  mozzarella: {
    id: 'mozzarella',
    name: 'Mozzarella',
    price: 0.00,
    category: 'cheese',
  },
  feta: {
    id: 'feta',
    name: 'Feta',
    price: 2.49,
    category: 'cheese',
  },
  parmesan: {
    id: 'parmesan',
    name: 'Parmesan',
    price: 2.49,
    category: 'cheese',
  },
  gorgonzola: {
    id: 'gorgonzola',
    name: 'Gorgonzola',
    price: 2.99,
    category: 'cheese',
  },
  ricotta: {
    id: 'ricotta',
    name: 'Ricotta',
    price: 2.49,
    category: 'cheese',
  },
  provolone: {
    id: 'provolone',
    name: 'Provolone',
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
  italianSausage: {
    id: 'italian-sausage',
    name: 'Italian Sausage',
    price: 2.99,
    category: 'meat',
  },
  bacon: {
    id: 'bacon',
    name: 'Bacon',
    price: 2.49,
    category: 'meat',
  },
  ham: {
    id: 'ham',
    name: 'Ham',
    price: 2.49,
    category: 'meat',
  },
  anchovies: {
    id: 'anchovies',
    name: 'Anchovies',
    price: 2.99,
    category: 'meat',
  },
  prosciutto: {
    id: 'prosciutto',
    name: 'Prosciutto',
    price: 3.49,
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
  },
  bellPeppers: {
    id: 'bell-peppers',
    name: 'Bell Peppers',
    price: 1.49,
    category: 'vegetable',
  },
  olives: {
    id: 'olives',
    name: 'Black Olives',
    price: 1.49,
    category: 'vegetable',
  },
  spinach: {
    id: 'spinach',
    name: 'Fresh Spinach',
    price: 1.49,
    category: 'vegetable',
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Fresh Tomatoes',
    price: 1.49,
    category: 'vegetable',
  },
  jalapenos: {
    id: 'jalapenos',
    name: 'Jalapeños',
    price: 1.49,
    category: 'vegetable',
  },
  pineapple: {
    id: 'pineapple',
    name: 'Pineapple',
    price: 1.99,
    category: 'vegetable',
  },
  artichokes: {
    id: 'artichokes',
    name: 'Artichokes',
    price: 2.49,
    category: 'vegetable',
  },
  roastedGarlic: {
    id: 'roasted-garlic',
    name: 'Roasted Garlic',
    price: 1.49,
    category: 'vegetable',
  }
}; 