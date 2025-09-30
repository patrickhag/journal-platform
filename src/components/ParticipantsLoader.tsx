import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ParticipantCardSkeleton = () => {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      {/* Avatar skeleton */}
      <Skeleton className="w-12 h-12 rounded-full" />

      <div className="flex-1 min-w-0">
        {/* Name skeleton */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Expertise section skeleton */}
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleSectionSkeleton = ({
  participantCount = 2,
}: {
  participantCount?: number;
}) => {
  return (
    <div>
      {/* Role header skeleton */}
      <div className="flex items-center mb-4">
        <Skeleton className="w-5 h-5 mr-2" />
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Participant cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: participantCount }).map((_, index) => (
          <ParticipantCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const ParticipantsLoader = () => {
  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>All Participants</CardTitle>
        <CardDescription>
          Everyone involved in the peer-review process for this manuscript
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Staff Editors Section */}
          <RoleSectionSkeleton participantCount={1} />
          <Separator />

          {/* Associate Editors Section */}
          <RoleSectionSkeleton participantCount={2} />
          <Separator />

          {/* Reviewers Section */}
          <RoleSectionSkeleton participantCount={3} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantsLoader;
