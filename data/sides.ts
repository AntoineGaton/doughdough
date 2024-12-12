export interface Side {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  quantity?: number;
}

export const sides: Side[] = [
  {
    id: 'garlic-knots',
    name: 'Garlic Knots',
    description: 'Soft, buttery knots of bread topped with garlic, herbs, and parmesan cheese',
    image: 'sides/garlic-knots.jpg',
    price: 5.99
  },
  {
    id: 'wings',
    name: 'Classic Wings',
    description: 'Crispy chicken wings tossed in your choice of sauce',
    image: 'sides/wings.jpg',
    price: 12.99
  },
  {
    id: 'cannoli',
    name: 'Cannoli',
    description: 'Traditional Italian pastry filled with sweet ricotta cream',
    image: 'sides/cannoli.jpg',
    price: 4.99
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    image: 'sides/tiramisu.jpg',
    price: 6.99
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Rich and creamy New York style cheesecake',
    image: 'sides/cheesecake.jpg',
    price: 6.99
  },
  {
    id: 'sugar-puffs',
    name: 'Sugar Puffs',
    description: 'Light and airy pastry puffs dusted with powdered sugar',
    image: 'sides/sugar-puffs.jpg',
    price: 4.99
  },
  {
    id: 'brookie',
    name: 'Brookie',
    description: 'A delicious hybrid of brownies and cookies',
    image: 'sides/brookie.jpg',
    price: 5.99
  }
];

export default sides;
