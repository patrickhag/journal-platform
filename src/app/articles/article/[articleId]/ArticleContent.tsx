'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Eye,
  Quote,
  Share2,
  ExternalLink,
  Calendar,
  Users,
  FileText,
  Tags,
  Copy,
  FileDown,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import sanitizeHtml from 'sanitize-html';
import { useGetPublishedArticle } from '@/hooks/usePublishArticle';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import PublishedArticleSkeleton from '../../components/PublishedArticleSkeleton';
import { downloadPublishedArticle } from '@/lib/downloadPublishedArticle';
import {
  useGetMetricInteraction,
  useIncrementMetrics,
  type CitationFormat,
} from '@/hooks/useMetrics';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { copyToClipboard } from '@/lib/utils';
import { ReferencesList } from '../../components/References';

export default function ArticleContent() {
  const { articleId } = useParams();

  const [showCiteModal, setShowCiteModal] = useState(false);
  const [viewCount, setViewCount] = useState(false);
  const [downloadCount, setDownloadCount] = useState(false);
  const [citationFormat, setCitationFormat] = useState<
    CitationFormat | undefined
  >(undefined);

  const { data: article, isPending } = useGetPublishedArticle(
    articleId as string
  );

  const { mutate } = useIncrementMetrics();

  const { data: metric } = useGetMetricInteraction(articleId as string);

  useEffect(() => {
    if (!article) {
      return;
    }

    if (viewCount || downloadCount || citationFormat) {
      const slug = article?.slug || (articleId as string);
      mutate(
        {
          slug,
          viewCount,
          downloadCount,
          citationFormat,
        },
        {
          onSuccess: () => {
            // Reset state after successful mutation
            setViewCount(false);
            setDownloadCount(false);
            setCitationFormat(undefined);
          },
        }
      );
    }
  }, [viewCount, downloadCount, citationFormat, mutate, articleId, article]);

  const articleData = article?.article;

  const author = {
    name: `${articleData?.user.firstName} ${articleData?.user.lastName}`,
    salutation: articleData?.metadata.prefix as string,
    affiliation: articleData?.user.affiliation as string,
    email: articleData?.user.email as string,
    orcid: articleData?.user.orcid as string,
  };

  const contributors = articleData ? [author, ...articleData.contributors] : [];

  const handleCite = () => {
    setShowCiteModal(true);
  };

  const generateRIS = () => {
    const authors = contributors.map((a) => `AU  - ${a.name}`).join('\n');
    return `TY  - JOUR
      TI  - ${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData?.metadata.subtitle : ''}
      ${authors}
      JO  - Journal of African Epidemiology and Public Health
      VL  - ${article?.issue.volume.year}
      IS  - ${article?.issue.issueNumber}
      SP  - ${article?.pageRange.split('-')[0]}
      EP  - ${article?.pageRange.split('-')[1]}
      PY  - ${article?.issue.volume.year}
      DO  - ${article?.doi}
      ER  -`;
  };

  const generateBibTeX = () => {
    const authors = contributors.map((a) => a.name).join(' and ');
    return `@article{${article?.id},
          title={${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData.metadata.subtitle : ''}},
          author={${authors}},
          journal={Journal of African Epidemiology and Public Health},
          volume={${article?.issue.volume.year}},
          number={${article?.issue.issueNumber}},
          pages={${article?.pageRange}},
          year={2025},
          doi={${article?.doi}},
          publisher={JAEPH}
        }`;
  };

  const downloadRisLatex = (
    content: string,
    filename: string,
    format: 'bibtexFormat' | 'risFormat'
  ) => {
    setCitationFormat(format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCitation = (content: string, format: 'APA' | 'AMA') => {
    const citationFormat: CitationFormat =
      format === 'APA' ? 'apaStyle' : 'amaStyle';
    setCitationFormat(citationFormat);
    copyToClipboard(content, format);
  };

  const generateAPA = () => {
    const authors = contributors.map((a) => a.name).join(', ');
    return `${authors} (2025). ${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData?.metadata.subtitle : ''}. Journal of African Epidemiology and Public Health, ${article?.issue.volume.year}(${article?.issue.issueNumber}), ${article?.pageRange}. ${article?.doi ? `https://doi.org/${article?.doi}` : ''}`;
  };

  const generateAMA = () => {
    const authors = contributors.map((a) => a.name).join(', ');
    return `${authors}. ${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData?.metadata.subtitle : ''}. Journal of African Epidemiology and Public Health. 2025;${article?.issue.volume.year}(${article?.issue.issueNumber}):${article?.pageRange}. ${article?.doi ? `https://doi.org/${article?.doi}` : ''}`;
  };

  return (
    <>
      {isPending ? (
        <PublishedArticleSkeleton />
      ) : !article ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 italic p-6 text-center text-gray-600">
          This article was not found.
        </div>
      ) : (
        article && (
          <>
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                <FileText className="w-3 h-3 mr-1" />
                {articleData?.section}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">
              {articleData?.metadata.title}
            </h1>
            {articleData?.metadata.subtitle && (
              <p className="text-xl text-muted-foreground mb-6">
                {articleData?.metadata.subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setDownloadCount(true);
                  downloadPublishedArticle(article.pdfUrl, article.slug);
                }}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setViewCount(true);
                  window.open(article.pdfUrl);
                }}
              >
                <Eye className="w-4 h-4" />
                View this article
              </Button>
              <Button variant="outline" onClick={handleCite} className="gap-2">
                <Quote className="w-4 h-4" />
                Cite this article
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <span className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> Share this article
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem
                      value="facebook"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                          '_blank'
                        );
                      }}
                    >
                      <FacebookIcon className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Facebook</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="twitter"
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?url=${window.location.href}`,
                          '_blank'
                        );
                      }}
                    >
                      <TwitterIcon className="w-4 h-4 text-blue-500 mr-2  " />
                      <span>Twitter</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="linkedin"
                      onClick={() => {
                        window.open(
                          `https://www.linkedin.com/shareArticle?url=${window.location.href}`,
                          '_blank'
                        );
                      }}
                    >
                      <LinkedinIcon className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Linkedin</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator className="mb-8" />

            {/* Authors */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Authors
                </h2>
              </div>
              <div className="space-y-1">
                {contributors.map((contributor, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <button className="text-foreground hover:underline">
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
                          <span className="text-sm font-semibold">
                            Affiliation:
                          </span>{' '}
                          <span>{contributor.affiliation}</span>
                        </p>
                        <p className="text-sm">
                          <span>
                            <span className="text-sm font-semibold">
                              Email:{' '}
                            </span>
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

            {/* Publication Info & Article Metrics */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Publication Details
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Submitted:</span>
                  <span>
                    {format(
                      new Date(articleData?.createdAt as string),
                      'MMMM d, yyyy'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Accepted:</span>
                  <span>
                    {format(
                      new Date(articleData?.acceptedAt as string),
                      'MMMM d, yyyy'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Published:</span>
                  <span>
                    {format(
                      new Date(article?.publishedAt as string),
                      'MMMM d, yyyy'
                    )}
                  </span>
                </div>
                {article?.doi && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <span className="font-medium">DOI:</span>
                    <span className="text-primary hover:underline cursor-pointer">
                      {article?.doi}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Article Details
                </h3>
                <div>
                  <span className="font-medium">Volume:</span>{' '}
                  {article?.issue?.volume.year},
                  <span className="font-medium ml-2">Issue:</span>{' '}
                  {article?.issue?.issueNumber}
                </div>
                <div>
                  <span className="font-medium">Pages:</span>{' '}
                  {article?.pageRange}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Article Metrics
                </h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Citations</span>
                  <span className="font-semibold text-primary">
                    {(metric?.citations?.bibtexFormat || 0) +
                      (metric?.citations?.risFormat || 0) +
                      (metric?.citations?.apaStyle || 0) +
                      (metric?.citations?.amaStyle || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Views</span>
                  <span className="font-semibold">{metric?.views}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Downloads</span>
                  <span className="font-semibold">{metric?.downloads}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Abstract */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Abstract
              </h2>

              <div
                className="prose prose-gray max-w-none text-foreground leading-relaxed text-justify"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(articleData?.metadata.abstract || ''),
                }}
              />
            </div>

            {/* Keywords */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tags className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {articleData?.metadata.topics.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-primary/10"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <ReferencesList references={article.references} />

            {/* Citation Modal */}
            <Dialog open={showCiteModal} onOpenChange={setShowCiteModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cite this article</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="gap-2 h-auto p-4 justify-start"
                      onClick={() =>
                        downloadRisLatex(
                          generateBibTeX(),
                          `${articleData?.metadata.title}.bib`,
                          'bibtexFormat'
                        )
                      }
                    >
                      <FileDown className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">
                          Download BibTeX Format
                        </div>
                        <div className="text-xs text-muted-foreground">
                          For LaTeX documents
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="gap-2 h-auto p-4 justify-start"
                      onClick={() =>
                        downloadRisLatex(
                          generateRIS(),
                          `${articleData?.metadata.title}.ris`,
                          'risFormat'
                        )
                      }
                    >
                      <FileDown className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">Download RIS Format</div>
                        <div className="text-xs text-muted-foreground">
                          For reference managers
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="gap-2 h-auto p-4 justify-start"
                      onClick={() => handleCopyCitation(generateAPA(), 'APA')}
                    >
                      <Copy className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">Copy APA Style</div>
                        <div className="text-xs text-muted-foreground">
                          American Psychological Association
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="gap-2 h-auto p-4 justify-start"
                      onClick={() => handleCopyCitation(generateAMA(), 'AMA')}
                    >
                      <Copy className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">Copy AMA Style</div>
                        <div className="text-xs text-muted-foreground">
                          American Medical Association
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">APA Style Preview:</h4>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {generateAPA()}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AMA Style Preview:</h4>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {generateAMA()}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )
      )}
    </>
  );
}
