'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  BookOpenIcon,
  UserCircle2Icon,
  FolderIcon,
  PlusIcon,
  SendIcon,
  Ellipsis,
  Dot,
} from 'lucide-react';
import { useGetVolumes } from '@/hooks/useVolumes';
import {
  useDeleteIssue,
  useEditIssue,
  useGetIssues,
  usePublishIssue,
} from '@/hooks/useIssues';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import Loader from '../Loader';
import { useEffect, useState } from 'react';
import { DeleteIssueDialog } from './DeleteIssueDialog';
import { EditIssueModal } from './EditIssueModal';
import { Issue } from '@/types';
import { IssueType } from '@/lib/schemas';
import IssueCardSkeleton from './IssueCardSkeleton';

export function IssueList() {
  const { data: volumes } = useGetVolumes();
  const { data: issues, isPending: isIssuePending } = useGetIssues();
  const [openDeleteIssueDialog, setOpenDeleteIssueDialog] = useState(false);
  const [allowIssueDeletion, setAllowIssueDeletion] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const router = useRouter();

  const { mutate, isPending } = usePublishIssue();
  const { mutate: deleteIssueMutation, isPending: isDeletingIssuePending } =
    useDeleteIssue(setOpenDeleteIssueDialog);

  const handleDeleteIssue = (issueId: string) => {
    setIssueToDelete(issueId);
    setOpenDeleteIssueDialog(true);
  };
  useEffect(() => {
    if (allowIssueDeletion) {
      deleteIssueMutation(issueToDelete ?? '');
      setAllowIssueDeletion(false);
    }
  }, [allowIssueDeletion]);

  const handlePublishIssue = ({
    issueId,
    articleIds,
  }: {
    issueId: string;
    articleIds: string[];
  }) => {
    if (!articleIds.length) return toast.error('No articles to publish!');
    mutate({ issueId, articleIds });
  };

  const { mutate: editIssueMutation } = useEditIssue();

  const handleEditSubmit = (data: IssueType & { articles: string[] }) => {
    editIssueMutation({ issueId: editingIssue?.id as string, data });
    setEditingIssue(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isIssuePending
          ? [1, 2].map((_, index) => <IssueCardSkeleton key={index} />)
          : issues?.map((issue) => (
              <Card key={issue.id} className="overflow-hidden">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <CardTitle className="text-2xl">
                          Issue {issue.issueNumber}
                        </CardTitle>
                        <Dot />
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          issue.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => setEditingIssue(issue)}
                        >
                          Edit Issue
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteIssue(issue.id)}
                        >
                          {isDeletingIssuePending ? (
                            <Loader text="Deleting..." />
                          ) : (
                            'Delete Issue'
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    <span>
                      Volume{' '}
                      {
                        volumes?.find((v) => v.id === issue.volumeId)
                          ?.volumeNumber
                      }
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    {issue.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Articles</h3>
                      <span className="text-sm text-muted-foreground">
                        {issue.articles?.length || 0} articles
                      </span>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {issue.articles?.map((article) => (
                          <div key={article.id} className="space-y-3">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-2">
                                <Link href={`/articles/${article.id}`}>
                                  {article.metadata.title}
                                </Link>
                              </h4>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center text-muted-foreground">
                                    <FolderIcon className="w-4 h-4 mr-1" />
                                    <span>{article.section}</span>
                                  </div>
                                  <Separator
                                    orientation="vertical"
                                    className="h-4"
                                  />
                                  <div className="flex items-center">
                                    <UserCircle2Icon className="w-4 h-4 mr-1 text-muted-foreground" />
                                    <span>
                                      {`${article.user.firstName} ${article.user.lastName}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!issue.articles || issue.articles.length === 0) && (
                          <div className="text-center py-8 text-muted-foreground">
                            No articles in this issue yet.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="flex-1"
                      variant="outline"
                      disabled={issue.status === 'Published'}
                      onClick={() => router.push('/editor/articles')}
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Assign Articles
                    </Button>
                    <Button
                      className="flex-1"
                      variant="default"
                      disabled={issue.status === 'Published'}
                      onClick={() => {
                        const articleIds = issue.articles.map(
                          (article) => article.id
                        );
                        handlePublishIssue({ issueId: issue.id, articleIds });
                      }}
                    >
                      {isPending ? (
                        <Loader text="Publishing..." />
                      ) : (
                        <>
                          <SendIcon className="w-4 h-4 mr-2" /> Publish Issue
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
      {openDeleteIssueDialog && (
        <DeleteIssueDialog
          open={openDeleteIssueDialog}
          onOpenChange={setOpenDeleteIssueDialog}
          setAllowIssueDeletion={setAllowIssueDeletion}
          isDeletingIssuePending={isDeletingIssuePending}
        />
      )}
      {editingIssue && (
        <EditIssueModal
          open={true}
          onOpenChange={(open) => !open && setEditingIssue(null)}
          onSubmit={handleEditSubmit}
          issue={editingIssue}
          volumes={volumes ?? []}
        />
      )}
    </>
  );
}
