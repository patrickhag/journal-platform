import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '@/styles/globals.scss';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const baseUrl = process.env.NEXT_PUBLIC_URL || '';
const imageUrl = `${baseUrl}/jaep-logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || ''),
  keywords: [
    'Journal of African Epidemiology and Public Health',
    'African Epidemiology',
    'Public Health in Africa and Epidemiology',
    'African Public Health',
    'Epidemiology Journal in Africa',
    'Public Health Journal in Africa',
    'Epidemiology Research in Africa',
    'African Public Health Journal',
    'Epidemiology in Public Health of Africa',
  ],
  title: {
    default: '  Journal of African Epidemiology and Public Health',
    template: `%s | Journal of African Epidemiology and Public Health`,
  },
  openGraph: {
    description:
      'Journal of African Epidemiology and Public Health is a leading journal in the field of epidemiology and public health in Africa.',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'Journal of African Epidemiology and Public Health',
      },
    ],
    locale: 'en_US',
  },
  icons: {
    icon: 'public/jaep-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Toaster position="bottom-right" className="bg-green-200" richColors />
        <SessionProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
