import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '../../../lib/firebase-admin';

// Explicitly declare the domain
const domain = process.env.NEXT_PUBLIC_BASE_URL;

if (!domain) {
  throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
}

export async function POST(req: Request) {
  try {
    const { items, userId, customerEmail } = await req.json();
    
    if (!items?.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Add console.log to debug URLs
    console.log('Domain:', domain);
    console.log('Success URL:', `${domain}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=test`);

    const orderRef = await adminDb.collection('orders').add({
      userId: userId || 'guest',
      items,
      status: 'pending',
      customerEmail: customerEmail || 'Guest',
      currentStage: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      total: items.reduce((sum: number, item: any) => 
        sum + (item.total * (item.quantity || 1)), 0
      )
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image?.startsWith('http') ? [item.image] : [],
          },
          unit_amount: Math.round(item.total * 100),
        },
        quantity: item.quantity || 1,
      })),
      metadata: {
        orderId: orderRef.id
      },
      success_url: `${domain}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderRef.id}`,
      cancel_url: `${domain}/cart`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      orderId: orderRef.id
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error creating checkout session' 
    }, { 
      status: 500 
    });
  }
} 