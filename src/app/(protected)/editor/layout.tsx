import Header from '@/components/Header';

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      {children}
    </div>
  );
}
