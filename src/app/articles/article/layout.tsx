import LeftSideBar from '@/components/landingPage/leftSideBar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">{children}</div>
        <LeftSideBar />
      </div>
    </div>
  );
}
