interface Side {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'bread' | 'dessert' | 'wings';
  price: number;
}

export const sides: Side[] = [
  {
    id: 'garlic-knots',
    name: 'Garlic Knots',
    description: 'Soft, buttery knots of bread topped with garlic, herbs, and parmesan cheese',
    image: 'sides/garlic-knots.jpg',
    category: 'bread',
    price: 5.99
  },
  {
    id: 'wings',
    name: 'Classic Wings',
    description: 'Crispy chicken wings tossed in your choice of sauce',
    image: 'sides/wings.jpg',
    category: 'wings',
    price: 12.99
  },
  {
    id: 'cannoli',
    name: 'Cannoli',
    description: 'Traditional Italian pastry filled with sweet ricotta cream',
    image: 'sides/cannoli.jpg',
    category: 'dessert',
    price: 4.99
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    image: 'sides/tiramisu.jpg',
    category: 'dessert',
    price: 6.99
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Rich and creamy New York style cheesecake',
    image: 'sides/cheesecake.jpg',
    category: 'dessert',
    price: 6.99
  },
  {
    id: 'sugar-puffs',
    name: 'Sugar Puffs',
    description: 'Light and airy pastry puffs dusted with powdered sugar',
    image: 'sides/sugar-puffs.jpg',
    category: 'dessert',
    price: 4.99
  },
  {
    id: 'brookie',
    name: 'Brookie',
    description: 'A delicious hybrid of brownies and cookies',
    image: 'sides/brookie.jpg',
    category: 'dessert',
    price: 5.99
  }
];

export default sides;
