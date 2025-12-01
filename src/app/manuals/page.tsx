import { db } from '@/db/db';
import GuidelineSection from '@/components/GuidelineSection';
import LeftSideBar from '@/components/landingPage/leftSideBar';

export default async function GuidelinesPage() {
  const manuals = await db.query.manuals.findFirst();

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8 px-4 py-6 mb-9">
        <div className="lg:w-3/4">
          {manuals?.guidelines?.forAuthors && (
            <GuidelineSection
              id="guidelines"
              title="Guidelines for Authors"
              description="Submission guidelines for authors"
            >
              <div
                className="prose max-w-none prose-sm"
                dangerouslySetInnerHTML={{
                  __html: manuals.guidelines.forAuthors,
                }}
              />
            </GuidelineSection>
          )}
          {manuals?.guidelines?.forReviewers && (
            <GuidelineSection
              id="guidelines"
              title="Guidelines for Reviewers"
              description="Guidelines for reviewers"
            >
              <div
                className="prose max-w-none prose-sm"
                dangerouslySetInnerHTML={{
                  __html: manuals.guidelines.forReviewers,
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
                className="prose max-w-none prose-sm"
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
                className="prose max-w-none prose-sm"
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
                className="prose max-w-none prose-sm"
                dangerouslySetInnerHTML={{
                  __html: manuals.aimsNscope.content,
                }}
              />
            </GuidelineSection>
          )}
          {manuals?.termsNconditions && (
            <GuidelineSection
              id="termsNconditions"
              title="Terms and conditions"
              description="Terms and conditions of the journal"
            >
              <div
                className="prose max-w-none prose-sm"
                dangerouslySetInnerHTML={{
                  __html: manuals?.termsNconditions.content,
                }}
              />
            </GuidelineSection>
          )}
        </div>
        <div className="lg:w-1/4">
          <LeftSideBar />
        </div>
      </div>
    </div>
  );
}
