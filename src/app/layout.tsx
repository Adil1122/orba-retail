import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PosProvider } from '@/context/PosAppContext';

export const metadata: Metadata = {
  title: 'ZYRO Retail POS New',
  description:
    'ZYRO Retail POS — full multi-role retail point of sale, inventory, accounting, and shop operations web application built with Next.js, React, and TypeScript.',
  openGraph: {
    title: 'ZYRO Retail POS New',
    description:
      'ZYRO Retail POS — full multi-role retail point of sale, inventory, accounting, and shop operations web application.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#162660',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&family=Noto+Naskh+Arabic:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <PosProvider>{children}</PosProvider>
      </body>
    </html>
  );
}
