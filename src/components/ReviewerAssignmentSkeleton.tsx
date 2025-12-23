import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, User, Calendar, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewerAssignmentSkeleton = ({
  isNotAssociate,
}: {
  isNotAssociate?: boolean;
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="mb-4" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Assignment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="w-full">
              {/* Title */}
              <Skeleton className="h-8 w-3/4 mb-2" />

              {/* Author and Due Date */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-gray-400" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Files Section */}
      {isNotAssociate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-gray-400" />
              Manuscript Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* File Item 1 */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-gray-400" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>

            {/* File Item 2 */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-gray-400" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Reviews Section */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5 text-gray-400" />
            Previous {isNotAssociate ? 'Review' : 'Correction'} History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div className="border rounded-lg p-4 bg-muted/50 mb-3" key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewerAssignmentSkeleton;
