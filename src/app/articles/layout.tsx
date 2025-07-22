import Footer from '@/components/landingPage/footer';
import Header from '@/components/landingPage/header';
import { Toaster } from 'sonner';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Toaster position="bottom-right" className="bg-green-200" richColors />
        {children}
      </main>
      <Footer />
    </div>
  );
}
