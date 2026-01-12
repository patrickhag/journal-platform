import {
  buildCrossRefLink,
  buildGoogleScholarLink,
  buildPubMedLink,
} from '@/lib/utils';
import { FileText } from 'lucide-react';

type ReferencesListProps = {
  references: string[];
};

export function ReferencesList({ references }: ReferencesListProps) {
  if (!references.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-primary" />

        <h3 className="text-lg font-semibold text-foreground">References</h3>
      </div>
      <div className="space-y-4 list-decimal list-inside">
        {references.map((ref, index) => {
          const crossRef = buildCrossRefLink(ref);

          return (
            <div key={index} className="text-gray-800 text-base">
              <p className="line-clamp-1">
                {index + 1}. {ref}
              </p>
              <div className="mt-1 flex items-center gap-1 text-blue-600">
                <a
                  href={buildGoogleScholarLink(ref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Scholar
                </a>
                <span className="h-4 border-l border-gray-300 mx-[3px]"></span>
                {crossRef && (
                  <>
                    <a
                      href={crossRef}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      CrossRef Full Text
                    </a>
                    <span className="h-4 border-l border-gray-300 mx-[3px]"></span>
                  </>
                )}
                <a
                  href={buildPubMedLink(ref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  PubMed
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
