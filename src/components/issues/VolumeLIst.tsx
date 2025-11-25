import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VolumeType } from '@/types';
import { BookIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import VolumeCardSkeleton from './VolumeCardSkeleton';
interface VolumeLIstProps {
  volumes: VolumeType;
  isVolumesPending: boolean;
}

export function VolumeList({ volumes, isVolumesPending }: VolumeLIstProps) {
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
                      <CardTitle>Volume {volume.volumeNumber}</CardTitle>
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
                  </div>
                  <CardDescription>{volume.title}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    Year: {volume.year}
                  </div>
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
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                issue.status === 'Published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {issue.status}
                            </span>
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
    </>
  );
}
