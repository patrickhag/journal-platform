import Footer from '@/components/landingPage/footer';
import Header from '@/components/landingPage/header';
import LeftSideBar from '@/components/landingPage/leftSideBar';
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
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">{children}</div>
            <LeftSideBar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
