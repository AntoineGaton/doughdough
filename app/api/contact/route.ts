import { NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    try {
      await limiter.check(5, 'CONTACT_FORM'); // 5 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();

    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const discordMessage = {
      embeds: [{
        title: "New Contact Form Submission",
        color: 0xc4391c,
        fields: [
          { name: "Name", value: name },
          { name: "Email", value: email },
          { name: "Message", value: message }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage)
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Discord');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}