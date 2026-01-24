'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VolumeType } from '@/types';
import {
  BookIcon,
  Ellipsis,
  Edit,
  Trash,
  Dot,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import VolumeCardSkeleton from './VolumeCardSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DeleteVolumeDialog } from './DeleteVolumeDialog';
import { DeleteIssueDialog } from './DeleteIssueDialog';
import { useDeleteIssue } from '@/hooks/useIssues';
import { useDeleteVolume, useEditVolume } from '@/hooks/useVolumes';
import { EditVolumeModal } from './EditVolumeModal';
import { VolumeType as VolumeFormValues } from '@/lib/schemas';
interface VolumeLIstProps {
  volumes: VolumeType;
  isVolumesPending: boolean;
}

export function VolumeList({ volumes, isVolumesPending }: VolumeLIstProps) {
  const [openDeleteVolumeDialog, setOpenDeleteVolumeDialog] = useState(false);
  const [allowVolumeDeletion, setAllowVolumeDeletion] = useState(false);
  const [volumeToDelete, setVolumeToDelete] = useState<string | null>(null);
  const [editingVolume, setEditingVolume] = useState<VolumeType[number] | null>(
    null
  );
  const [openDeleteIssueDialog, setOpenDeleteIssueDialog] = useState(false);
  const [allowIssueDeletion, setAllowIssueDeletion] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);

  const { mutate: deleteVolumeMutation, isPending: isDeletingVolumePending } =
    useDeleteVolume(setOpenDeleteVolumeDialog);

  const { mutate: deleteIssueMutation, isPending: isDeletingIssuePending } =
    useDeleteIssue(setOpenDeleteIssueDialog);

  const { mutate: editVolumeMutation, isPending: isUpdatingVolumePending } =
    useEditVolume();

  useEffect(() => {
    if (allowVolumeDeletion) {
      deleteVolumeMutation(volumeToDelete ?? '');
      setAllowVolumeDeletion(false);
    }
  }, [allowVolumeDeletion, deleteVolumeMutation, volumeToDelete]);

  useEffect(() => {
    if (allowIssueDeletion) {
      deleteIssueMutation(issueToDelete ?? '');
      setAllowIssueDeletion(false);
    }
  }, [allowIssueDeletion, deleteIssueMutation, issueToDelete]);

  const handleEditVolumeSubmit = (data: VolumeFormValues) => {
    if (!editingVolume) {
      return;
    }

    editVolumeMutation(
      { volumeId: editingVolume.id, data },
      {
        onSuccess: () => {
          setEditingVolume(null);
        },
      }
    );
  };

  const handleDeleteVolume = (volumeId: string) => {
    setVolumeToDelete(volumeId);
    setOpenDeleteVolumeDialog(true);
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssueToDelete(issueId);
    setOpenDeleteIssueDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isVolumesPending
          ? [1, 2, 3].map((_, index) => <VolumeCardSkeleton key={index} />)
          : volumes.map((volume) => (
              <Card key={volume.id}>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle>Volume of {volume.year}</CardTitle>
                      <Dot className="text-muted-foreground" />
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          volume.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {volume.status}
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
                          onSelect={() => setEditingVolume(volume)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Volume
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteVolume(volume.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Volume
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className='sr-only'>{volume.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Related Issues</h3>
                      <span className="text-xs text-muted-foreground">
                        {volume.issues?.length || 0} issues
                      </span>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-3">
                        {volume.issues?.map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <BookIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  Issue {issue.issueNumber}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {issue.title}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  issue.status === 'Published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {issue.status}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                  >
                                    <Ellipsis className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteIssue(issue.id)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remove Issue
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                        {(!volume.issues || volume.issues.length === 0) && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No issues in this volume yet
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
        {volumes?.length === 0 && !isVolumesPending && (
          <div className="flex items-center justify-center text-muted-foreground">
            No volumes have been created yet. Create one instead!
          </div>
        )}
      </div>
      {openDeleteVolumeDialog && (
        <DeleteVolumeDialog
          open={openDeleteVolumeDialog}
          onOpenChange={setOpenDeleteVolumeDialog}
          setAllowVolumeDeletion={setAllowVolumeDeletion}
          isDeletingVolumepending={isDeletingVolumePending}
        />
      )}
      {openDeleteIssueDialog && (
        <DeleteIssueDialog
          open={openDeleteIssueDialog}
          onOpenChange={setOpenDeleteIssueDialog}
          setAllowIssueDeletion={setAllowIssueDeletion}
          isDeletingIssuePending={isDeletingIssuePending}
        />
      )}
      {editingVolume && (
        <EditVolumeModal
          open={true}
          onOpenChange={(open) => !open && setEditingVolume(null)}
          onSubmit={handleEditVolumeSubmit}
          volume={editingVolume}
          isUpdatingVolumePending={isUpdatingVolumePending}
        />
      )}
    </>
  );
}
