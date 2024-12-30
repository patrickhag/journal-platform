import Footer from '@/components/landingPage/footer';
import Header from '@/components/landingPage/header';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import SearchBar from '@/components/landingPage/searchBar';

export default async function AboutPage() {
  return (
    <main>
      <div>
        <Header />
        <main className="px-8 py-6">
          <section className="flex flex-col gap-8">
            <SearchBar />
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 space-y-8">
                <div className="w-[90%] text-gray-800">
                  <h1
                    className="text-2xl font-bold mb-4 "
                    style={{ color: '#1A237E' }}
                  >
                    About JAEPH
                  </h1>
                  <p className="my-2">
                    The Journal of African Epidemiology and Public Health
                    focuses on improving health across Africa by sharing
                    research on important public health issues. We publish
                    studies on topics like infectious diseases, chronic
                    illnesses, environmental health, and disease prevention. Our
                    goal is to provide knowledge that helps create effective
                    health policies, improve healthcare systems, and promote
                    health equity across communities.
                  </p>
                  <p className="my-2">
                    We bring together researchers, policymakers, and health
                    professionals to tackle challenges and find sustainable
                    health solutions. By highlighting innovative approaches and
                    fostering collaboration within Africa and beyond, we aim to
                    support better health outcomes for individuals and
                    populations. Our journal is a platform for sharing impactful
                    research that makes a real difference in public health.
                  </p>
                </div>
              </div>
              <LeftSideBar />
            </div>
            <Footer />
          </section>
        </main>
      </div>
    </main>
  );
}
