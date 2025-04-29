'use client';

import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useGetProof, useGetProofs } from '@/hooks/useProofs';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Upload, FileText, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getStatusBadge } from '@/components/proofs/ProofStatusBadge';
import { CreateProofModal } from '@/components/proofs/CreateProofModal';

function ProofPage() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { data: articleProof } = useGetProof(userId as string);
  const [isProofCardOpen, setIsProofCardOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  const handleProof = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsProofCardOpen(true);
  };

  return (
    <>
      <div className="mt-6">
        {articleProof?.map((article) => (
          <Card key={article.id} className="w-full">
            <div className="p-6">
              <div className="flex items-start justify-between space-y-0">
                <div className="w-full">
                  <CardTitle className="text-xl font-semibold line-clamp-1">
                    {article.metadata.title}
                  </CardTitle>
                  <CardDescription className="mt-2 w-full">
                    <div className="flex gap-1">
                      <span>
                        {`${article.user.firstName} ${article.user.lastName}`} •{' '}
                        {article.user.affiliation},
                      </span>
                      <div className="flex flex-col items-center gap-2 text-sm">
                        <span>Submitted on: {article.createdAt}</span>
                      </div>
                    </div>
                    {Array.isArray(article.proofFileUrl) &&
                      article.proofFileUrl.length > 0 && (
                        <div className="mt-2 w-full">
                          {article.proofFileUrl.map((fileUrl, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg mb-2 w-full"
                            >
                              <div className="flex items-center space-x-4">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Proofed file</p>
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
                    {article.proofNote && (
                      <div className="mt-4 border border-muted rounded-md p-4 shadow-sm bg-muted/50 w-full">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Comments
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {article.proofNote}
                        </p>
                      </div>
                    )}
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
    </>
  );
}

export default ProofPage;
