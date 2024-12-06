import * as admin from 'firebase-admin';
import { pizzas } from '@/data/pizzas';
import { ingredients } from '@/data/ingredients';
import { deals } from '@/data/deals';

// Import the service account JSON directly
import serviceAccount from '../doughdough-cc6c5-firebase-adminsdk-1vl7k-e228428bda.json';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

const db = admin.firestore();

async function seedDatabase() {
  try {
    // Initialize pizzas first
    const initializedPizzas = await Promise.all(
      pizzas.map(async (pizza) => ({
        ...pizza,
        image: await pizza.image
      }))
    );

    // Seed pizzas
    const pizzaBatch = db.batch();
    initializedPizzas.forEach((pizza) => {
      const docRef = db.collection('pizzas').doc(pizza.id.toString());
      pizzaBatch.set(docRef, pizza);
    });
    await pizzaBatch.commit();
    console.log('Pizzas seeded successfully');

    // Seed ingredients
    const ingredientBatch = db.batch();
    Object.entries(ingredients).forEach(([key, ingredient]) => {
      const docRef = db.collection('ingredients').doc(key);
      ingredientBatch.set(docRef, ingredient);
    });
    await ingredientBatch.commit();
    console.log('Ingredients seeded successfully');

    // Seed deals
    const dealsBatch = db.batch();
    deals.forEach((deal) => {
      const docRef = db.collection('deals').doc(deal.id);
      dealsBatch.set(docRef, deal);
    });
    await dealsBatch.commit();
    console.log('Deals seeded successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();