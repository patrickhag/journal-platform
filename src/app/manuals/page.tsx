import { db } from '@/db/db';
import GuidelineSection from '@/components/GuidelineSection';
import Header from '@/components/landingPage/header';
import Footer from '@/components/landingPage/footer';
import GuidelineSidebar from '@/components/GuidelineSidebar';

export default async function GuidelinesPage() {
  const manuals = await db.query.manuals.findFirst();

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="px-4 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-12 px-4 py-6">
          {/* Sidebar */}
          <GuidelineSidebar manuals={manuals || {}} />
          {/* Main Section */}
          <div className="lg:w-10/12">
            {/* Render each manual section if it exists */}
            {manuals?.guidelines && (
              <GuidelineSection
                id="guidelines"
                title="Guidelines"
                description="Submission guidelines and expectations"
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: manuals.guidelines.content,
                  }}
                />
              </GuidelineSection>
            )}
            {manuals?.policies?.privacyPolicy && (
              <GuidelineSection
                id="policies"
                title="Policies"
                description="Privacy and editorial policies"
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: manuals.policies.privacyPolicy,
                  }}
                />
              </GuidelineSection>
            )}
            {manuals?.aboutUs?.content && (
              <GuidelineSection
                id="aboutUs"
                title="About Us"
                description="Information about the journal"
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: manuals.aboutUs.content }}
                />
              </GuidelineSection>
            )}
            {manuals?.aimsNscope?.content && (
              <GuidelineSection
                id="aimsNscope"
                title="Aims and Scope"
                description="Scope and focus of the journal"
              >
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: manuals.aimsNscope.content,
                  }}
                />
              </GuidelineSection>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
