import { useState } from 'react';
import { ingredients } from '@/data/ingredients';
import { calculatePizzaPrice, formatPrice } from '@/utils/calculatePizzaPrice';
import { useCart } from '@/hooks/useCart';
import { Button } from './ui/button';
import Image from 'next/image';

export function CustomPizzaBuilder() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['regularCrust', 'tomatoSauce', 'mozzarella']);
  const { addToCart } = useCart();

  const ingredientsByCategory = Object.entries(ingredients).reduce((acc, [id, ingredient]) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push({ ...ingredient, id });
    return acc;
  }, {} as Record<string, typeof ingredients[keyof typeof ingredients][]>);

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients(prev => {
      // For base/crust selection
      if (ingredients[ingredientId]?.category === 'base') {
        if (prev.includes(ingredientId)) {
          return prev;
        }
        const withoutBase = prev.filter(id => ingredients[id]?.category !== 'base');
        return [...withoutBase, ingredientId];
      }

      // For sauce selection
      if (ingredients[ingredientId]?.category === 'sauce') {
        if (prev.includes(ingredientId)) {
          return prev;
        }
        const withoutSauce = prev.filter(id => ingredients[id]?.category !== 'sauce');
        return [...withoutSauce, ingredientId];
      }

      // For cheese selection - allow multiple but keep mozzarella
      if (ingredients[ingredientId]?.category === 'cheese') {
        if (ingredientId === 'mozzarella') {
          // Don't allow removing mozzarella
          return prev;
        }
        // Toggle other cheeses freely
        if (prev.includes(ingredientId)) {
          return prev.filter(id => id !== ingredientId);
        }
        return [...prev, ingredientId];
      }
      
      // Handle other ingredients normally
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      }
      return [...prev, ingredientId];
    });
  };

  const handleAddToCart = () => {
    const price = calculatePizzaPrice(selectedIngredients);
    const selectedIngredientNames = selectedIngredients
      .map(id => ingredients[id as keyof typeof ingredients]?.name)
      .filter(Boolean)
      .join(', ');

    addToCart({
      id: 'custom-pizza',
      name: 'Custom Pizza',
      description: `Custom pizza with ${selectedIngredientNames}`,
      price,
      tax: price * 0.13,
      total: price * 1.13,
      image: '/pizzas/custom.jpg',
      selectedIngredients
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Build Your Custom 12" Pizza</h2>
      <Image src="/pizzas/custom.jpg" alt="Custom Pizza" width={500} height={500} className="mb-4 w-full"/>
      <div className="space-y-6">
        {Object.entries(ingredientsByCategory).map(([category, categoryIngredients]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold capitalize">{category === 'base' || category === 'crust' || category === 'sauce' ? `${category}: Choose One` : category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient.id);
                const isBase = ingredient.category === 'base';
                const isSauce = ingredient.category === 'sauce';
                
                return (
                  <div
                    key={ingredient.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-red-100 border-red-500'
                        : (isBase && selectedIngredients.some(id => ingredients[id]?.category === 'base')) ||
                          (isSauce && selectedIngredients.some(id => ingredients[id]?.category === 'sauce'))
                          ? 'opacity-50 hover:bg-gray-50'
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleIngredientToggle(ingredient.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{ingredient.name}</span>
                      {!['tomatoSauce', 'mozzarella'].includes(ingredient.id) && (
                        <span className="text-sm text-gray-600">
                          {formatPrice(ingredient.price)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-primary h-20 mb-6 mt-6 border-t pt-4 -mx-6 px-6 h-full">
        <div className="text-xl font-bold mb-4">
          Total: {formatPrice(calculatePizzaPrice(selectedIngredients))}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
} 