import { getPizzaImage } from '@/utils/images';

let initializedPizzas: Pizza[] | null = null;

export async function initializePizzas() {
  if (initializedPizzas) return initializedPizzas;
  
  const pizzaData = [...pizzas];
  await Promise.all(
    pizzaData.map(async (pizza) => {
      pizza.image = await getPizzaImage(pizza.name.toLowerCase());
    })
  );
  
  initializedPizzas = pizzaData;
  return pizzaData;
}

export type Pizza = {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: string;
  ingredients: string[];
  isCustom?: boolean;
  isPopular?: boolean;
};

export const pizzas: Pizza[] = [
  {
    id: "0",
    name: "BBQ Chicken",
    description: "Grilled chicken, bacon, onions with sweet BBQ sauce",
    price: "17.99",
    ingredients: ['chicken', 'bacon', 'onions', 'bbq-sauce'],
    isPopular: true
  },
  {
    id: "1",
    name: "Buffalo Chicken",
    description: "Spicy buffalo chicken, ranch, mozzarella, red onions",
    price: "18.99",
    ingredients: ['buffalo-chicken', 'ranch-sauce', 'mozzarella', 'red-onions'],
    isPopular: false
  },
  {
    id: "2",
    name: "Cheese Pizza",
    description: "A classic cheese pizza with a thin crust",
    price: "10.99",
    ingredients: ['mozzarella', 'tomato-sauce'],
    isCustom: true,
    isPopular: true
  },
  {
    id: "3",
    name: "Custom",
    description: "Create your own perfect pizza",
    price: "10.99",
    ingredients: [],
    isCustom: true,
    isPopular: true
  },
  {
    id: "4",
    name: "Four Cheese",
    description: "Mozzarella, parmesan, gorgonzola, and ricotta cheese blend",
    price: "17.99",
    ingredients: ['mozzarella', 'parmesan', 'gorgonzola', 'ricotta', 'tomato-sauce'],
    isPopular: true
  },
  {
    id: "5",
    name: "Hawaiian",
    description: "Ham, pineapple, extra mozzarella on our signature sauce",
    price: "17.99",
    ingredients: ['ham', 'pineapple', 'mozzarella', 'tomato-sauce'],
    isPopular: false
  },
  {
    id: "6",
    name: "Margherita",
    description: "Fresh mozzarella, tomatoes, basil on our signature sauce",
    price: "16.99",
    ingredients: ['mozzarella', 'tomatoes', 'basil', 'tomato-sauce'],
    isPopular: false
  },
  {
    id: "7",
    name: "Meat Lovers",
    description: "Pepperoni, sausage, ham, bacon, seasoned pork, beef",
    price: "19.99",
    ingredients: ['pepperoni', 'italian-sausage', 'ham', 'bacon', 'pork', 'beef'],
    isPopular: true
  },
  {
    id: "8",
    name: "Mediterranean",
    description: "Feta, olives, sun-dried tomatoes, spinach, garlic",
    price: "18.99",
    ingredients: ['feta', 'olives', 'sun-dried-tomatoes', 'spinach', 'garlic'],
    isPopular: false
  },
  {
    id: "9",
    name: "Pepperoni Perfection",
    description: "Double pepperoni, extra cheese, Italian seasoning",
    price: "17.99",
    ingredients: ['pepperoni', 'mozzarella', 'italian-seasoning'],
    isPopular: true
  },
  {
    id: "10",
    name: "Spicy Italian",
    description: "Spicy Italian sausage, pepperoni, hot peppers, and garlic",
    price: "18.99",
    ingredients: ['italian-sausage', 'pepperoni', 'hot-peppers', 'garlic'],
    isPopular: false
  },
  {
    id: "11",
    name: "Supreme",
    description: "Pepperoni, Italian sausage, mushrooms, onions, green peppers",
    price: "18.99",
    ingredients: ['pepperoni', 'italian-sausage', 'mushrooms', 'onions', 'green-peppers'],
    isPopular: true
  },
  {
    id: "12",
    name: "Truffle Mushroom",
    description: "Truffle oil, assorted mushrooms, garlic, and fresh herbs",
    price: "19.99",
    ingredients: ['truffle-oil', 'mushrooms', 'garlic', 'herbs'],
    isPopular: false
  },
  {
    id: "13",
    name: "Veggie Delight",
    description: "Mushrooms, onions, peppers, olives, tomatoes, spinach",
    price: "16.99",
    ingredients: ['mushrooms', 'onions', 'green-peppers', 'olives', 'tomatoes', 'spinach'],
    isPopular: false
  },
  {
    id: "14",
    name: "White Pizza",
    description: "Olive oil base, roasted garlic, ricotta, and mozzarella",
    price: "16.99",
    ingredients: ['olive-oil', 'garlic', 'ricotta', 'mozzarella'],
    isPopular: false
  }
]; 