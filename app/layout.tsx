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
  title: "DoughDough Pizza",
  description: 'Fresh, delicious pizzas delivered to your door.',
  icons: {
    icon: [
      { url: '/mobile-icons/16.png', sizes: '16x16', type: 'image/png' },
      { url: '/mobile-icons/32.png', sizes: '32x32', type: 'image/png' },
      { url: '/mobile-icons/64.png', sizes: '64x64', type: 'image/png' },
      { url: '/mobile-icons/128.png', sizes: '128x128', type: 'image/png' },
      { url: '/mobile-icons/256.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/mobile-icons/180.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: [{ url: '/favicon.ico' }],
  },
  manifest: '/site.webmanifest',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#fafaf5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
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