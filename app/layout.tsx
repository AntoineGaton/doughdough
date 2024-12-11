import './globals.css';
import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

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
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${oswald.className} overflow-x-hidden`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <NavBar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}