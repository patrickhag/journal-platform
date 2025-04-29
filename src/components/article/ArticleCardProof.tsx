'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useGetProofs } from '@/hooks/useProofs';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  Upload,
  FileText,
  EyeIcon,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { CreateProofModal } from '../proofs/CreateProofModal';
import { getStatusBadge } from '../proofs/ProofStatusBadge';
import { PublishArticleDialog } from './PublishArticleModal';

export function ArticleCardProof() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { data: articleProofs } = useGetProofs(userId as string);
  const [isProofCardOpen, setIsProofCardOpen] = useState(false);
  const [isPublishCardOpen, setisPublishCardOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  const handleProof = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsProofCardOpen(true);
  };

  const handlePublish = (articleId: string) => {
    setSelectedArticleId(articleId);
    setisPublishCardOpen(true);
  };

  return (
    <>
      <div className="mt-9">
        {articleProofs?.map((article) => (
          <Card key={article.id} className="w-full my-3">
            <div className="p-6">
              <div className="flex items-start justify-between space-y-0">
                <div className="w-full">
                  <CardTitle className="text-xl font-semibold line-clamp-1">
                    {article.metadata.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex gap-1">
                      <span>
                        {`${article.user.firstName} ${article.user.lastName}`}{' '}
                        •{' '}
                      </span>
                      {article.user.affiliation && (
                        <span>{article.user.affiliation || ''} • </span>
                      )}
                      <div className="flex flex-col items-center gap-2 text-sm">
                        <span>Submitted on: {article.createdAt}</span>
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {getStatusBadge(article.proofStatus)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        <Link href={`${article.files[0].publicId}`}>
                          View article
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProof(article.id)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload a proof
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {Array.isArray(article.proofFileUrl) &&
                article.proofFileUrl.length > 0 && (
                  <div className="mt-6 w-full">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Proofed file
                    </p>
                    {article.proofFileUrl.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg mb-2 w-full"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Proofed document</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" asChild>
                          <Link
                            target="_blank"
                            href={fileUrl || '#'}
                            rel="noopener noreferrer"
                          >
                            <span className="flex items-center">
                              <EyeIcon className="mr-2 text-gray-600" />
                              View
                            </span>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

              {/* Editor's Comments section - full width */}
              {article.proofNote && (
                <div className="mt-4 w-full">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Editor&apos;s Comments
                  </p>
                  <div className="border border-muted rounded-md p-4 shadow-sm bg-muted/50 w-full">
                    <p className="text-sm text-muted-foreground">
                      {article.proofNote}
                    </p>
                  </div>
                </div>
              )}

              {article.proofStatus === 'AuthorResponded' && (
                <div className="flex justify-start mt-6">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handlePublish(article.id)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish This Manuscript
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isProofCardOpen && selectedArticleId && (
        <CreateProofModal
          articleId={selectedArticleId}
          open={isProofCardOpen}
          onOpenChange={setIsProofCardOpen}
        />
      )}
      {isPublishCardOpen && selectedArticleId && (
        <PublishArticleDialog
          open={isPublishCardOpen}
          onOpenChange={setisPublishCardOpen}
          articleId={selectedArticleId}
        />
      )}
    </>
  );
}
