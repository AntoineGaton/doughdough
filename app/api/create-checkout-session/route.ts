import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '../../../lib/firebase-admin';

const domain = process.env.NEXT_PUBLIC_BASE_URL;
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!domain) {
  throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
}

if (!webhookUrl) {
  throw new Error('Discord webhook URL is not defined');
}

async function sendToDiscord(orderDetails: any) {
  const { items, userId, customerEmail, orderId, total, deliveryMethod, orderDetails: details } = orderDetails;

  const itemsList = items.map((item: any) => 
    `• ${item.quantity}x ${item.name} ($${item.total.toFixed(2)})`
  ).join('\n');

  const embed = {
    title: `🍕 New ${deliveryMethod === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'} Order!`,
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
        value: deliveryMethod === 'delivery' ? '���� Delivery' : '🏪 Pickup',
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

  await fetch(webhookUrl as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ embeds: [embed] })
  });
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

    const total = items.reduce((sum: number, item: any) => 
      sum + (item.total * (item.quantity || 1)), 0
    );

    // Create order in Firebase
    const orderRef = await adminDb.collection('orders').add({
      userId: userId || 'guest',
      items,
      status: 'pending',
      customerEmail: customerEmail || 'Guest',
      currentStage: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      total,
      deliveryMethod,
      customerDetails: orderDetails // Save customer details
    });

    // Send order details to Discord
    await sendToDiscord({
      items,
      userId,
      customerEmail,
      orderId: orderRef.id,
      total,
      deliveryMethod,
      orderDetails
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image?.startsWith('http') ? [item.image] : 
                   item.id === 'custom-pizza' ? [`https://firebasestorage.googleapis.com/v0/b/doughdough-cc6c5.firebasestorage.app/o/pizzas%2Fcustom.jpg?alt=media&token=09bfd7e4-d92a-41ec-8f2a-0f27e6e38769`] : [],
          },
          unit_amount: Math.round(item.total * 100),
        },
        quantity: item.quantity || 1,
      })),
      metadata: {
        orderId: orderRef.id
      },
      success_url: new URL(`/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderRef.id}`, domain).toString(),
      cancel_url: new URL('/cart', domain).toString(),
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