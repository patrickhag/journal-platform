import Collections from '@/components/landingPage/collection';
import Footer from '@/components/landingPage/footer';
import Header from '@/components/landingPage/header';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import RightSideBar from '@/components/landingPage/rightSideBar';

export default async function Home() {
  return (
    <main>
      <div className="font-sans">
        <Header />
        <main className="px-4 md:px-8 py-6">
          <section className="flex flex-col gap-8">
            <RightSideBar />
            <div className="grid sm:grid-cols-4 grid-cols-1 gap-2">
              <Collections />
              <LeftSideBar />
            </div>
            <Footer />
          </section>
        </main>
      </div>
    </main>
  );
}
