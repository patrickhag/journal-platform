'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { useGetPublishedArticle } from '@/hooks/usePublishArticle';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import PublishedArticleSkeleton from '../../components/PublishedArticleSkeleton';
import { downloadPublishedArticle } from '@/lib/downloadPublishedArticle';
import { toast } from 'sonner';

export default function PublicArticleView() {
  const { articleId } = useParams();

  const [showCiteModal, setShowCiteModal] = useState(false);

  const { data: article, isPending } = useGetPublishedArticle(
    articleId as string
  );

  const articleData = article?.article;

  const author = {
    name: `${articleData?.user.firstName} ${articleData?.user.lastName}`,
    salutation: articleData?.metadata.prefix!,
    affiliation: articleData?.user.affiliation!,
  };

  const contributors = articleData ? [author, ...articleData.contributors] : [];

  const handleCite = () => {
    setShowCiteModal(true);
  };

  const handleShare = () => {
    console.log('Share article');
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

  const downloadRisLatex = (content: string, filename: string) => {
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

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${format} citation copied successfully.`);
    });
  };

  const generateAPA = () => {
    const authors = contributors.map((a) => a.name).join(', ');
    return `${authors} (2025). ${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData?.metadata.subtitle : ''}. Journal of African Epidemiology and Public Health, ${article?.issue.volume.year}(${article?.issue.issueNumber}), ${article?.pageRange}. https://doi.org/${article?.doi}`;
  };

  const generateAMA = () => {
    const authors = contributors.map((a) => a.name).join(', ');
    return `${authors}. ${articleData?.metadata.title}${articleData?.metadata.subtitle ? ': ' + articleData?.metadata.subtitle : ''}. Journal of African Epidemiology and Public Health. 2025;${article?.issue.volume.year}(${article?.issue.issueNumber}):${article?.pageRange}. https://doi.org/${article?.doi}`;
  };

  return (
    <>
      {isPending ? (
        <PublishedArticleSkeleton />
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
            <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
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
                onClick={() =>
                  downloadPublishedArticle(article.pdfUrl, article.slug)
                }
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
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
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share this article
              </Button>
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
              <div className="space-y-3">
                {contributors.map((author, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary/20 pl-4"
                  >
                    <p className="font-medium text-foreground">
                      {author.salutation} {author.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {author.affiliation}
                    </p>
                  </div>
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
                  <span className="text-muted-foreground">Citations</span>
                  <span className="font-semibold text-primary">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-semibold">1,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-semibold">523</span>
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
                          `${articleData?.metadata.title}.bib`
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
                          `${articleData?.metadata.title}.ris`
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
                      onClick={() => copyToClipboard(generateAPA(), 'APA')}
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
                      onClick={() => copyToClipboard(generateAMA(), 'AMA')}
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
