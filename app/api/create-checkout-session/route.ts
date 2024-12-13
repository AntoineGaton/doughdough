import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '../../../lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { items, userId, customerName } = await req.json();
    
    if (!items?.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Create the order in Firestore first
    const orderRef = await adminDb.collection('orders').add({
      userId: userId || 'guest',
      items,
      status: 'completed',
      customerName: userId ? customerName : 'Guest',
      currentStage: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      total: items.reduce((sum: number, item: any) => 
        sum + (item.price * (item.quantity || 1)), 0
      )
    });

    // Then create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image || '/fallback-pizza.jpg'],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      metadata: {
        orderId: orderRef.id // Add orderId to metadata
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderRef.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      orderId: orderRef.id
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 