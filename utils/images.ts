const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function getPizzaImage(pizzaName: string): Promise<string> {
  try {
    // Simple, focused search query
    const query = pizzaName.toLowerCase().includes('pizza') 
      ? pizzaName 
      : `${pizzaName} pizza`;
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape`
    );
    console.dir(response);
    const data = await response.json();
    return data.results[0]?.urls.regular;
  } catch (error) {
    console.error('Error fetching pizza image:', error);
    return '/fallback-pizza.jpg';
  }
} 