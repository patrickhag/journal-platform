import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import { SessionProvider } from 'next-auth/react';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || ''),
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
        <SessionProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
