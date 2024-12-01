import './globals.css';
import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import { NavBar } from '@/components/NavBar';

const oswald = Oswald({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'DoughDoughs Pizza - Online Ordering',
  description: 'Fresh, delicious pizzas delivered to your door',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${oswald.className} overflow-x-hidden`}>
        <NavBar />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}