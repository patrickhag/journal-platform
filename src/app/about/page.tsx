import Collections from '@/components/landingPage/collection';
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
                    The Journal of African Epidemiology and Public Health is a
                    leading platform dedicated to advancing knowledge and
                    innovation in the fields of epidemiology and public health
                    across Africa. Our mission is to address health disparities
                    and promote health equity by publishing evidence-based
                    research that informs effective public health interventions,
                    policy development, and healthcare systems improvement. We
                    are committed to showcasing studies on infectious and
                    chronic diseases, environmental health, and preventive
                    medicine that resonate with the unique challenges and
                    opportunities in African contexts.
                  </p>
                  <p className="my-2">
                    Through interdisciplinary and collaborative approaches, the
                    journal fosters dialogue among researchers, policymakers,
                    and practitioners across the continent and beyond. By
                    promoting translational research and sustainable health
                    solutions, we aim to bridge the gap between science and
                    practice, ensuring that the latest advancements contribute
                    to meaningful health outcomes at the community and
                    population levels. Our focus includes disease surveillance,
                    biostatistics, and global health perspectives, with an
                    emphasis on addressing the social determinants of health.
                  </p>
                  <p className="my-2">
                    As a catalyst for regional collaboration and global
                    partnerships, the Journal of African Epidemiology and Public
                    Health is dedicated to knowledge dissemination and capacity
                    building. By supporting innovative and multisectoral
                    approaches to healthcare, the journal serves as a vital
                    resource for advancing health equity and shaping resilient
                    healthcare systems across Africa and the world. Join us in
                    our mission to create lasting impact through impactful
                    research and dialogue.
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
