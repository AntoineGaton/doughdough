import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const discordMessage = {
      embeds: [{
        title: "New Contact Form Submission",
        color: 0xc4391c, // DoughDough's red color
        fields: [
          { name: "Name", value: name },
          { name: "Email", value: email },
          { name: "Message", value: message }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
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