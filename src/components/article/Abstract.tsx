import { Badge } from '../ui/badge';
import { DateFormatter } from '@/lib/formateDate';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export interface AbstractProps {
  articleData: {
    updatedAt: string | null | Date;
    id: string;
    section: string | null;
    metadata: {
      title: string;
      subtitle: string | null;
      abstract: string;
    };
    user: {
      firstName: string | null;
      lastName: string | null;
      affiliation: string | null;
      email: string | null;
      orcid: string | null;
    };
    files: {
      publicId: string | null;
      fileType: string | null;
    }[];
    contributors: {
      name: string;
      affiliation: string | null;
      email: string | null;
      orcid: string | null;
      role: string;
    }[];
  };
}

export async function Abstract({ articleData }: AbstractProps) {
  const contributors = articleData?.contributors.map((contributor) => ({
    name: contributor.name,
    affiliation: contributor.affiliation,
    email: contributor.email,
    orcid: contributor.orcid,
    role: contributor.role,
  }));

  const mainAuthor = {
    name: articleData.user.firstName + ' ' + articleData.user.lastName,
    affiliation: articleData.user.affiliation,
    email: articleData.user.email,
    orcid: articleData.user.orcid,
    role: 'Main Author',
  };

  contributors.unshift(mainAuthor);

  return (
    <div className="col-span-3 space-y-8">
      <div className="w-[90%]">
        <Badge className="bg-slate-500">{articleData?.section || ''}</Badge>
        <h1 className="text-2xl font-bold my-4" style={{ color: '#141A26' }}>
          {articleData?.metadata?.title}
        </h1>

        <div className="my-4">
          <h3 className="text-xl font-bold" style={{ color: '#1A237E' }}>
            Authors
          </h3>
          <div>
            {contributors.map((contributor, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <button className="text-gray-600 hover:text-gray-800 hover:underline">
                    <span className="mr-2">
                      {contributor.name}
                      {contributors.indexOf(contributor) !==
                        contributors.length - 1 && ','}
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-sm font-semibold">Role: </span>
                      {contributor.role}
                    </p>
                    <p className="text-sm">
                      <span className="text-sm font-semibold">
                        Affiliation:
                      </span>{' '}
                      <span>{contributor.affiliation}</span>
                    </p>
                    <p className="text-sm">
                      <span>
                        <span className="text-sm font-semibold">Email: </span>
                        {contributor.email}
                      </span>
                    </p>
                    {contributor.orcid && (
                      <p className="text-sm">
                        <span className="flex items-center">
                          <img
                            src="/orcid.jpg"
                            alt="ORCID LOGO"
                            width={25}
                            height={20}
                          />
                          <span className="ml-2">{contributor.orcid}</span>
                        </span>
                      </p>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          <span className="font-bold">Published:</span>{' '}
          {DateFormatter(articleData?.updatedAt)}
        </p>

        <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
          Abstract
        </h2>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{
            __html: articleData?.metadata?.abstract || '',
          }}
        />
      </div>
    </div>
  );
}
