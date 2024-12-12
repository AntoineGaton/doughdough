// Interface for the deals data
export interface Deal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discount: string;
  terms: string;
  price: number;
  isActive: boolean;
  featured: boolean;
  validityRules: {
    type: 'date' | 'time' | 'always' | 'weekday';
    month?: number;
    day?: number;
    startHour?: number;
    endHour?: number;
    days?: number[];
  };
}

// Used for testing and initial data in Firebase
export const deals: Deal[] = [
  {
    id: "christmas-special",
    title: "Christmas Day Special! 🎄",
    description: "Buy any large pizza and get a second one FREE! Plus a complimentary hot chocolate.",
    discount: "2-FOR-1",
    imageUrl: "https://images.unsplash.com/photo-1576438162986-c685b1cfed9f",
    price: 0.00,
    terms: "Valid only on December 25th. Cannot be combined with other offers.",
    validityRules: {
      type: "date",
      month: 12,
      day: 25
    },
    isActive: true,
    featured: true
  },
  {
    id: "family-feast",
    title: "Family Feast Bundle",
    description: "2 Large pizzas, 2 sides, and a 2L drink",
    discount: "BUNDLE",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    price: 39.99,
    terms: "Available for delivery and pickup. Additional toppings extra.",
    validityRules: {
      type: "always"
    },
    isActive: true,
    featured: true
  },
  {
    id: "student-special",
    title: "Student Special",
    description: "50% off any medium pizza with valid student ID",
    discount: "50%",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    price: 7.99,
    terms: "Must show valid student ID at checkout. One pizza per ID.",
    validityRules: {
      type: "always"
    },
    isActive: true,
    featured: false
  },
  {
    id: "weekday-lunch",
    title: "Weekday Lunch Special",
    description: "Personal pizza + drink combo",
    discount: "COMBO",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    price: 8.99,
    terms: "Available Monday-Friday, 11AM-3PM only.",
    validityRules: {
      type: "weekday",
      days: [1, 2, 3, 4, 5],
      startHour: 11,
      endHour: 15
    },
    isActive: true,
    featured: true
  },
  {
    id: "late-night",
    title: "Late Night Deal",
    description: "30% off all orders after 10PM",
    discount: "30%",
    imageUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de",
    price: 0.00,
    terms: "Valid from 10PM to 2AM daily.",
    validityRules: {
      type: "time",
      startHour: 22,
      endHour: 2
    },
    isActive: true,
    featured: false
  }
]; 