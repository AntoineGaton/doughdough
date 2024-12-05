import * as admin from 'firebase-admin';
import { pizzas } from '@/data/pizzas';
import { ingredients } from '@/data/ingredients';

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

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function createAdminUser() {
  const adminEmail = 'admin@doughdough.com'; // Replace with your email
  const adminPassword = 'rootroot'; // Add a temporary password
  
  try {
    // Create a new admin user
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Admin User',
      emailVerified: true
    });
    console.log('Successfully created new user:', userRecord.uid);

    // Set custom claims for the admin user
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log('Successfully set custom claims for user:', userRecord.uid);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

seedDatabase();
createAdminUser();