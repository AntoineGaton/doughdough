import { ingredients } from '@/data/ingredients';

const MARKUP_PERCENTAGE = 1.4; // 40% markup

export function calculatePizzaPrice(selectedIngredients: string[]): number {
  const basePrice = selectedIngredients.reduce((total, ingredientId) => {
    return total + (ingredients[ingredientId as keyof typeof ingredients]?.price || 0);
  }, 0);
  
  return basePrice * MARKUP_PERCENTAGE;
}

// Helper function to format price
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
} 