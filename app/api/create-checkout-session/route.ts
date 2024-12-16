import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

const domain = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
  throw new Error('Discord webhook URL is not defined');
}

async function sendToDiscord(orderDetails: any) {
  const { items, userId, customerEmail, orderId, total, deliveryMethod, orderDetails: details } = orderDetails;

  const itemsList = items.map((item: any) => 
    `• ${item.quantity}x ${item.name} ($${item.total.toFixed(2)})`
  ).join('\n');

  const embed = {
    title: `🍕 New ${deliveryMethod === 'delivery' ? '🚗' : '🏪'} Order!`,
    color: 0xc4391c,
    fields: [
      {
        name: "Order ID",
        value: orderId,
        inline: true
      },
      {
        name: "Customer",
        value: `${details.name}\n${details.phone}`,
        inline: true
      },
      {
        name: "Order Type",
        value: deliveryMethod === 'delivery' ? '🚗 Delivery' : '🏪 Pickup',
        inline: true
      },
      ...(deliveryMethod === 'delivery' ? [{
        name: "Delivery Address",
        value: details.address,
        inline: false
      }] : []),
      {
        name: "Items",
        value: itemsList
      },
      {
        name: "Total Amount",
        value: `$${total.toFixed(2)}`,
        inline: true
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "DoughDough's Pizza"
    }
  };

  try {
    const response = await fetch(webhookUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] })
    });
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Webhook failed:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { items, userId, customerEmail, deliveryMethod, orderDetails } = await req.json();
    
    if (!items?.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Create order in Firebase
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
      ),
      deliveryMethod,
      customerDetails: orderDetails
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.total * 100),
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      metadata: {
        orderId: orderRef.id,
        deliveryMethod,
        customerName: orderDetails.name,
        customerPhone: orderDetails.phone,
        customerAddress: orderDetails.address || ''
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
    return NextResponse.json(
      { error: 'Error initializing order. Please try again.' }, 
      { status: 500 }
    );
  }
} 