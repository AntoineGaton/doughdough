interface Drink {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'cocktail' | 'mocktail' | 'beer' | 'wine' | 'spirit' | 'soft-drink' | 'water';
  price?: number;
}

export const drinks: Drink[] = [
  {
    id: 'coke-20oz',
    name: 'Coca-Cola (20 oz)',
    description: 'Classic Coca-Cola soft drink in a 20oz bottle',
    image: 'drinks/coke-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'coke-2liter',
    name: 'Coca-Cola (2 Liter)',
    description: 'Classic Coca-Cola soft drink in a 2-liter bottle',
    image: 'drinks/coke-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'coke-zero-20oz',
    name: 'Coca-Cola Zero (20 oz)',
    description: 'Zero-sugar Coca-Cola in a 20oz bottle',
    image: 'drinks/cokezero-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'coke-zero-2liter',
    name: 'Coca-Cola Zero (2 Liter)',
    description: 'Zero-sugar Coca-Cola in a 2-liter bottle',
    image: 'drinks/cokezero-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'dr-pepper-20oz',
    name: 'Dr Pepper (20 oz)',
    description: 'Classic Dr Pepper soft drink in a 20oz bottle',
    image: 'drinks/drpepper-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'dr-pepper-2liter',
    name: 'Dr Pepper (2 Liter)',
    description: 'Classic Dr Pepper soft drink in a 2-liter bottle',
    image: 'drinks/drpepper-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'dr-pepper-zero-20oz',
    name: 'Dr Pepper Zero (20 oz)',
    description: 'Zero-sugar Dr Pepper in a 20oz bottle',
    image: 'drinks/drpepperzero-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'dr-pepper-zero-2liter',
    name: 'Dr Pepper Zero (2 Liter)',
    description: 'Zero-sugar Dr Pepper in a 2-liter bottle',
    image: 'drinks/drpepperzero-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'fanta-20oz',
    name: 'Fanta (20 oz)',
    description: 'Orange Fanta soft drink in a 20oz bottle',
    image: 'drinks/fanta-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'fanta-2liter',
    name: 'Fanta (2 Liter)',
    description: 'Orange Fanta soft drink in a 2-liter bottle',
    image: 'drinks/fanta-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'sprite-20oz',
    name: 'Sprite (20 oz)',
    description: 'Lemon-lime Sprite soft drink in a 20oz bottle',
    image: 'drinks/sprite-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'sprite-2liter',
    name: 'Sprite (2 Liter)',
    description: 'Lemon-lime Sprite soft drink in a 2-liter bottle',
    image: 'drinks/sprite-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'sprite-zero-20oz',
    name: 'Sprite Zero (20 oz)',
    description: 'Zero-sugar Sprite in a 20oz bottle',
    image: 'drinks/spritezero-20oz.jpg',
    category: 'soft-drink',
    price: 2.49
  },
  {
    id: 'sprite-zero-2liter',
    name: 'Sprite Zero (2 Liter)',
    description: 'Zero-sugar Sprite in a 2-liter bottle',
    image: 'drinks/spritezero-2liter.jpg',
    category: 'soft-drink',
    price: 4.99
  },
  {
    id: 'water',
    name: 'Bottled Water',
    description: 'Pure refreshing bottled water',
    image: 'drinks/water.jpg',
    category: 'water',
    price: 1.99
  }
];

export default drinks;
