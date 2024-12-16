import { ingredients } from '@/data/ingredients';

const MARKUP_PERCENTAGE = 1.4; // 40% markup
const FREE_INGREDIENTS = ['tomatoSauce', 'mozzarella'];

export function calculatePizzaPrice(selectedIngredients: string[]): number {
  const basePrice = selectedIngredients.reduce((total, ingredientId) => {
    // Skip if it's a free ingredient
    if (FREE_INGREDIENTS.includes(ingredientId)) {
      return total;
    }
    
    const ingredient = ingredients[ingredientId];
    // Only add price if ingredient exists and has a price
    if (ingredient && ingredient.price) {
      return total + ingredient.price;
    }
    return total;
  }, 0);
  
  return Number((basePrice * MARKUP_PERCENTAGE).toFixed(2));
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
} 