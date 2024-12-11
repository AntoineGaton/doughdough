import * as admin from 'firebase-admin';
import { pizzas } from '@/data/pizzas';
import { ingredients } from '@/data/ingredients';
import { deals } from '@/data/deals';

// Import the service account JSON directly
import serviceAccount from '../doughdough-cc6c5-firebase-adminsdk-1vl7k-e228428bda.json';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'doughdough-cc6c5.appspot.com'
  });
}

const db = admin.firestore();
const storage = admin.storage();

async function getPizzaImageUrl(pizzaName: string): Promise<string> {
  try {
    const bucket = storage.bucket('doughdough-cc6c5.firebasestorage.app');
    // Map pizza names to actual file names
    const fileNameMap: { [key: string]: string } = {
      "Cheese Pizza": "cheese",
      "Supreme": "supreme",
      "Margherita": "margherita",
      "BBQ Chicken": "bbq-chicken",
      "Meat Lovers": "meat-lovers",
      "Hawaiian": "hawaiian",
      "Veggie Delight": "veggie",
      "Buffalo Chicken": "buffalo-chicken",
      "Pepperoni Perfection": "pepperoni",
      "Mediterranean": "mediterranean",
      "Four Cheese": "four-cheese",
      "White Pizza": "white",
      "Spicy Italian": "spicy-italian",
      "Truffle Mushroom": "truffle-mushroom",
      "Custom": "custom"
    };

    const fileName = `pizzas/${fileNameMap[pizzaName] || pizzaName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    console.log('\x1b[36m%s\x1b[0m', `Looking for image: ${fileName}`);
    console.log('\x1b[36m%s\x1b[0m', `Full path: gs://${bucket.name}/${fileName}`);
    
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      console.warn('\x1b[31m%s\x1b[0m', `❌ Image not found for ${pizzaName} at path: ${fileName}`);
      return '';
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    });

    console.log('\x1b[32m%s\x1b[0m', `✅ Found image for ${pizzaName}`);
    return url;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error getting image URL for ${pizzaName}:`, error);
    return '';
  }
}

async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    
    // Clear existing pizzas
    const pizzasSnapshot = await db.collection('pizzas').get();
    const deletePromises = pizzasSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log('Cleared existing pizzas');

    // Add pizzas with images to Firestore
    for (const pizza of pizzas) {
      const imageUrl = await getPizzaImageUrl(pizza.name);
      await db.collection('pizzas').add({
        ...pizza,
        image: imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added ${pizza.name} with image URL`);
    }
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding process
seedDatabase();