'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpenIcon, BookIcon, PlusIcon } from 'lucide-react';
import type { VolumeType, IssueType } from '@/lib/schemas';
import { VolumeList } from '@/components/issues/VolumeLIst';
import { IssueList } from '@/components/issues/IssueList';
import { IssueModal } from '@/components/issues/IssueModal';
import { VolumeModal } from '@/components/issues/VolumeModal';
import { useCreateVolume, useGetVolumes } from '@/hooks/useVolumes';
import { useCreateIssue } from '@/hooks/useIssues';

export default function App() {
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  const { data: volumes } = useGetVolumes();
  const createVolumeMutation = useCreateVolume(setVolumeOpen);

  const handleVolumeSubmit = (data: VolumeType) => {
    createVolumeMutation.mutate(data);
  };

  const { mutate, isPending: isIssueCreationPending } =
    useCreateIssue(setIssueOpen);

  const handleIssueSubmit = (data: IssueType) => {
    mutate(data);
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="issues" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <BookIcon className="w-4 h-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="volumes" className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              Volumes
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4">
            <Button onClick={() => setIssueOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Issue
            </Button>
            <Button onClick={() => setVolumeOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Volume
            </Button>
          </div>
        </div>

        <TabsContent value="volumes" className="space-y-4">
          <VolumeList volumes={Array.isArray(volumes) ? volumes : []} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <IssueList />
        </TabsContent>
      </Tabs>

      <VolumeModal
        open={volumeOpen}
        onOpenChange={setVolumeOpen}
        onSubmit={handleVolumeSubmit}
      />

      {volumes?.length !== 0 && (
        <IssueModal
          open={issueOpen}
          onOpenChange={setIssueOpen}
          onSubmit={handleIssueSubmit}
          isIssueCreationPending={isIssueCreationPending}
        />
      )}
    </div>
  );
}
