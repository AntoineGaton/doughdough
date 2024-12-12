import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json();
    
    if (!items?.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Create order using admin SDK
    const orderRef = await adminDb.collection('orders').add({
      userId,
      items,
      status: 'pending',
      currentStage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderRef.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        userId,
        orderId: orderRef.id
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 