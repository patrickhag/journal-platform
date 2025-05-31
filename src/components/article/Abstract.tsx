'use client';

import { Badge } from '../ui/badge';
import { DateFormatter } from '@/lib/formateDate';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import sanitizeHtml from 'sanitize-html';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useIncrementMetrics } from '@/hooks/useMetrics';
import { toast } from 'sonner';
import Loader from '../Loader';

export interface ArticleDataProps {
  articleData: {
    updatedAt: string | null | Date;
    id: string;
    section: string | null;
    publishedFile: string | null;
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
    contributors: {
      name: string;
      affiliation: string | null;
      email: string | null;
      orcid: string | null;
      role: string;
    }[];
  };
}

export function Abstract({ articleData }: ArticleDataProps) {
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

  const [downloadCount, setDownloadCount] = useState(false);
  const [isDownloadPending, setIsDownloadPending] = useState(false);

  const { mutate: incrementMetrics } = useIncrementMetrics();

  const handleDownload = () => {
    if (articleData.publishedFile) {
      setIsDownloadPending(true);
      fetch(articleData.publishedFile)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to download file');
          return response.blob();
        })
        .then((fileBlob) => {
          const blobUrl = URL.createObjectURL(fileBlob);

          const link = document.createElement('a');
          link.href = blobUrl;

          const fileName = articleData.metadata.title
            ? `${articleData.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
            : 'article.pdf';

          link.setAttribute('download', fileName);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(blobUrl);
          setIsDownloadPending(false);
          setDownloadCount(true);
        })
        .catch((error) => {
          console.error('Download failed:', error);
          toast('Failed to download the file. Please try again.');
        });
    }
  };

  useEffect(() => {
    if (downloadCount) {
      incrementMetrics({ articleId: articleData.id as string, downloadCount });
    }
  }, [downloadCount, incrementMetrics, articleData.id]);

  return (
    <div className="col-span-3 space-y-8 pr-5">
      <div>
        <div className="flex justify-between">
          <Badge className="bg-slate-500 hover:bg-slate-500 h-5">
            {articleData?.section || ''}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={handleDownload}>
                  {isDownloadPending ? (
                    <Loader />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-500 text-white font-semibold">
                <p>Download this article</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold" style={{ color: '#141A26' }}>
            {articleData?.metadata?.title}
          </h1>

          <div>
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
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Published on:</span>{' '}
            {DateFormatter(articleData?.updatedAt)}
          </p>

          <h2
            className="text-xl font-bold mb-2 mt-2"
            style={{ color: '#1A237E' }}
          >
            Abstract
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(articleData?.metadata?.abstract || ''),
            }}
          />
        </div>
      </div>
    </div>
  );
}
