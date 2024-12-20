/**
 * @fileoverview Firebase Admin utility for seeding the database with initial data
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK
 * - @/data/pizzas: Pizza menu data
 * - @/data/ingredients: Ingredient data
 * - @/data/deals: Deals data
 * - @/data/drinks: Drinks data
 * - @/data/sides: Sides data
 * 
 * Environment Variables Required:
 * - FIREBASE_TYPE
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_PRIVATE_KEY_ID
 * - FIREBASE_PRIVATE_KEY
 * - FIREBASE_CLIENT_EMAIL
 * - FIREBASE_CLIENT_ID
 * - FIREBASE_AUTH_URI
 * - FIREBASE_TOKEN_URI
 * - FIREBASE_AUTH_PROVIDER_X509_CERT_URL
 * - FIREBASE_CLIENT_X509_CERT_URL
 * 
 * Features:
 * - Initializes Firebase Admin SDK
 * - Seeds database with initial data
 * - Handles image URL generation
 * - Manages data versioning
 */

import * as admin from 'firebase-admin';
import { pizzas } from '@/data/pizzas';
import { ingredients } from '@/data/ingredients';
import { deals } from '@/data/deals';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { drinks } from '../data/drinks';
import { sides } from '../data/sides'

/**
 * Firebase Admin configuration using environment variables
 */
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

/**
 * Initialize Firebase Admin SDK if not already initialized
 */
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error);
  }
}

export default admin;

const db = admin.firestore();
const storage = admin.storage();

/**
 * Retrieves the signed URL for a pizza image from Firebase Storage
 * @param pizzaName - Name of the pizza to get image for
 * @returns Promise<string> - Signed URL for the pizza image
 */
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

/**
 * Retrieves the signed URL for a drink image from Firebase Storage
 * @param drinkPath - Path to the drink image
 * @returns Promise<string> - Signed URL for the drink image
 */
async function getDrinkImageUrl(drinkPath: string): Promise<string> {
  try {
    const bucket = storage.bucket('doughdough-cc6c5.firebasestorage.app');
    const fileName = `${drinkPath}`;
    console.log('\x1b[36m%s\x1b[0m', `Looking for drink image: ${fileName}`);
    console.log('\x1b[36m%s\x1b[0m', `Full path: gs://${bucket.name}/${fileName}`);
    
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      console.warn('\x1b[31m%s\x1b[0m', `❌ Image not found for drink at path: ${fileName}`);
      return '';
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    });

    console.log('\x1b[32m%s\x1b[0m', `✅ Found drink image at ${fileName}`);
    return url;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error getting drink image URL:`, error);
    return '';
  }
}

/**
 * Retrieves the signed URL for a side item image from Firebase Storage
 * @param sidePath - Path to the side item image
 * @returns Promise<string> - Signed URL for the side item image
 */
async function getSideImageUrl(sidePath: string): Promise<string> {
  try {
    const bucket = storage.bucket('doughdough-cc6c5.firebasestorage.app');
    const fileName = `sides/${sidePath}`;
    console.log('\x1b[36m%s\x1b[0m', `Looking for side image: ${fileName}`);
    console.log('\x1b[36m%s\x1b[0m', `Full path: gs://${bucket.name}/${fileName}`);
    
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      console.warn('\x1b[31m%s\x1b[0m', `❌ Image not found for side at path: ${fileName}`);
      return '';
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    });

    console.log('\x1b[32m%s\x1b[0m', `✅ Found side image at ${fileName}`);
    return url;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error getting side image URL:`, error);
    return '';
  }
}

/**
 * Seeds the database with initial pizza data
 * Clears existing data and adds new data with image URLs
 */
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

/**
 * Seeds the database with drink data
 * Clears existing data and adds new data with image URLs
 */
async function uploadDrinksToFirestore() {
  try {
    // Clear existing drinks
    const drinksSnapshot = await db.collection('drinks').get();
    const deletePromises = drinksSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log('Cleared existing drinks');

    // Add drinks with images
    for (const drink of drinks) {
      const imageUrl = await getDrinkImageUrl(drink.image.replace('@drinks/', ''));
      await db.collection('drinks').add({
        ...drink,
        image: imageUrl, // Replace the path with the actual URL
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added drink: ${drink.name} with image URL`);
    }
    
    console.log('Drinks upload completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading drinks:', error);
    process.exit(1);
  }
}

/**
 * Seeds the database with side items data
 * Clears existing data and adds new data with image URLs
 */
async function uploadSidesToFirestore() {
  try {
    // Clear existing sides
    const sidesSnapshot = await db.collection('sides').get();
    const deletePromises = sidesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log('Cleared existing sides');

    // Add sides with images
    for (const side of sides) {
      const imageUrl = await getSideImageUrl(side.image?.replace('sides/', '') || '');
      await db.collection('sides').add({
        ...side,
        image: imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added side: ${side.name} with image URL`);
    }
    
    console.log('Sides upload completed successfully!');
  } catch (error) {
    console.error('Error uploading sides:', error);
    process.exit(1);
  }
}

// Comment out the pizza seeding for now
// seedDatabase();
// uploadDrinksToFirestore();
uploadSidesToFirestore();