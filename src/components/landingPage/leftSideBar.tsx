import Link from 'next/link';
import { getPublishedVolumes, getManual, getMostViewed } from '@/actions';
import AdsSection from './AdsSection';
import { MetricsSection } from './MetricsSection';

const LeftSideBar = async () => {
  const { data: volumes, error: volumesError } = await getPublishedVolumes();
  const { data: manuals, error: manualsError } = await getManual();
  const { data: mostViewed, error: mostViewedError } = await getMostViewed();

  return (
    <div className="sticky top-0 border-l pl-3">
      <div className="space-y-6 border-gray-200 rounded-lg">
        {/* Important Information Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Important Information
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/editorial-board" className="hover:text-blue-600">
                Editorial board
              </Link>
            </li>
            <li>
              <Link href="/manuals/#guidelines" className="hover:text-blue-600">
                Submission guidelines
              </Link>
            </li>
            <li>
              <Link
                href="/manuals/manuscript-editing-services"
                className="hover:text-blue-600"
              >
                Manuscript editing services
              </Link>
            </li>
            <li>
              <Link
                href="/manuals/#instructionToAuthors"
                className="hover:text-blue-600"
              >
                For Authors
              </Link>
            </li>
            <li>
              <Link
                href="/manuals/#instructionToReviewers"
                className="hover:text-blue-600"
              >
                For Reviewers
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-blue-600">
                Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Most Accessed Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Most Accessed
          </h2>
          {mostViewedError ? (
            <p className="text-sm text-red-600">{mostViewedError}</p>
          ) : (
            <ul className="mt-2 space-y-4">
              {mostViewed?.map((item) => (
                <li key={item.id} className="text-sm text-gray-600">
                  <Link
                    href={item.publishedArticle.slug as string}
                    className="block hover:text-blue-600"
                  >
                    {item.publishedArticle.article.metadata.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Advertisements Section (client component) */}
        <AdsSection />

        {/* Volumes Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Volumes
          </h2>
          {volumesError ? (
            <p className="text-sm text-red-600">{volumesError}</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {Array.isArray(volumes) && volumes.length > 0 ? (
                volumes.map((vol) => (
                  <Link
                    key={vol.id}
                    href="/articles/issues"
                    className="hover:text-blue-600"
                  >
                    Volume {vol.year} ({vol.issues.length})
                  </Link>
                ))
              ) : (
                <p>No volumes found</p>
              )}
            </ul>
          )}
        </div>

        {/* Downloads Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Downloads
          </h2>
          {manualsError ? (
            <p className="text-sm text-red-600">{manualsError}</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href={manuals?.[0]?.copyrightTemplate ?? '#'}
                  className="hover:text-blue-600"
                >
                  Copyright form
                </Link>
              </li>
              <li>
                <Link
                  href={manuals?.[0]?.paperTemplate ?? '#'}
                  className="hover:text-blue-600"
                >
                  Paper template
                </Link>
              </li>
              <li>
                <Link
                  href={manuals?.[0]?.humanPartsConsent ?? '#'}
                  className="hover:text-blue-600"
                >
                  Human participants checklist
                </Link>
              </li>
            </ul>
          )}
        </div>
        {/* Metrics Section */}
        <div className="w-full">
          <h2
            className="text-lg font-semibold text-gray-700 mb-3"
            style={{ color: '#1A237E' }}
          >
            Metrics
          </h2>
          <MetricsSection />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
