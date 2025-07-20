'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Eye,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Reply,
} from 'lucide-react';
import { toast } from 'sonner';
import AuthorReplyModal from '../../reviews/components/AuthorReplyModal';
import { useSession } from 'next-auth/react';
import { useGetAuthorsRevisions } from '@/hooks/useReviews';

interface Review {
  id: string;
  reviewerName: string;
  submittedAt: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE';
  comments: string;
  recommendations: 'ACCEPT' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'REJECT';
}

interface Manuscript {
  id: string;
  title: string;
  submittedAt: string;
  lastUpdated: string;
  status: 'UNDER_REVIEW' | 'REVIEW_COMPLETED' | 'REVISION_NEEDED';
  reviewsCompleted: number;
  totalReviews: number;
  reviews: Review[];
}

const ReviewsReceived = () => {
  const [manuscripts] = useState<Manuscript[]>([
    {
      id: '1',
      title: 'Machine Learning Applications in Healthcare Data Analysis',
      submittedAt: '2024-01-15',
      lastUpdated: '2024-02-10',
      status: 'REVIEW_COMPLETED',
      reviewsCompleted: 3,
      totalReviews: 3,
      reviews: [
        {
          id: 'r1',
          reviewerName: 'Dr. Smith',
          submittedAt: '2024-02-05',
          status: 'COMPLETED',
          comments:
            'Well-written paper with solid methodology. Minor revisions needed for clarity.',
          recommendations: 'MINOR_REVISION',
        },
        {
          id: 'r2',
          reviewerName: 'Dr. Johnson',
          submittedAt: '2024-02-08',
          status: 'COMPLETED',
          comments:
            'Excellent work. The approach is novel and results are compelling.',
          recommendations: 'ACCEPT',
        },
        {
          id: 'r3',
          reviewerName: 'Dr. Brown',
          submittedAt: '2024-02-10',
          status: 'COMPLETED',
          comments:
            'Good foundation but requires significant improvements in data analysis section.',
          recommendations: 'MAJOR_REVISION',
        },
      ],
    },
    {
      id: '2',
      title: 'Quantum Computing Algorithms for Optimization Problems',
      submittedAt: '2024-02-01',
      lastUpdated: '2024-02-15',
      status: 'UNDER_REVIEW',
      reviewsCompleted: 2,
      totalReviews: 3,
      reviews: [
        {
          id: 'r4',
          reviewerName: 'Dr. Wilson',
          submittedAt: '2024-02-12',
          status: 'COMPLETED',
          comments:
            'Interesting approach to quantum optimization. Some technical details need clarification.',
          recommendations: 'MINOR_REVISION',
        },
        {
          id: 'r5',
          reviewerName: 'Dr. Davis',
          submittedAt: '2024-02-15',
          status: 'COMPLETED',
          comments:
            'Strong theoretical foundation. Experimental validation would strengthen the work.',
          recommendations: 'MINOR_REVISION',
        },
      ],
    },
  ]);

  const { data } = useGetAuthorsRevisions();
  console.log('author-revisions:', data);

  const [selectedManuscript, setSelectedManuscript] =
    useState<Manuscript | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      UNDER_REVIEW: {
        variant: 'default' as const,
        label: 'Under Review',
        icon: Clock,
      },
      REVIEW_COMPLETED: {
        variant: 'default' as const,
        label: 'Review Completed',
        icon: CheckCircle,
      },
      REVISION_NEEDED: {
        variant: 'destructive' as const,
        label: 'Revision Needed',
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRecommendationBadge = (recommendation: string) => {
    const config = {
      ACCEPT: { variant: 'default' as const, label: 'Accept' },
      MINOR_REVISION: {
        variant: 'secondary' as const,
        label: 'Minor Revision',
      },
      MAJOR_REVISION: {
        variant: 'destructive' as const,
        label: 'Major Revision',
      },
      REJECT: { variant: 'destructive' as const, label: 'Reject' },
    };

    const badgeConfig = config[recommendation as keyof typeof config];
    return badgeConfig ? (
      <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
    ) : null;
  };

  const handleViewReviews = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
  };

  const handleDownloadReview = (reviewId: string) => {
    toast('Review document is being downloaded.');
  };

  const handleReplyToReview = (review: Review) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const canReplyToReview = (recommendation: string) => {
    return (
      recommendation === 'MINOR_REVISION' || recommendation === 'MAJOR_REVISION'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Author Responses</h1>
      </div>

      {/* Manuscripts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manuscripts with Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manuscript Title</TableHead>
                <TableHead>Revised At</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manuscripts.map((manuscript) => (
                <TableRow key={manuscript.id}>
                  <TableCell className="font-medium">
                    {manuscript.title}
                  </TableCell>
                  <TableCell>
                    {new Date(manuscript.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Dr. John Doe</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleViewReviews(manuscript)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Reviews
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Details */}
      {selectedManuscript && (
        <Card>
          <CardHeader>
            <CardTitle>Revisions for: {selectedManuscript.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedManuscript.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{review.reviewerName}</h4>
                      <p className="text-sm text-gray-600">
                        Revised:{' '}
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRecommendationBadge(review.recommendations)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Comments:</h5>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {review.comments}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReview(review.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Review
                      </Button>

                      {canReplyToReview(review.recommendations) && (
                        <Button
                          size="sm"
                          onClick={() => handleReplyToReview(review)}
                          className="flex items-center gap-2"
                        >
                          <Reply className="h-4 w-4" />
                          Reply to Revision
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Modal */}
      {selectedReview && (
        <AuthorReplyModal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          manuscriptTitle={selectedManuscript?.title || ''}
        />
      )}
    </div>
  );
};

export default ReviewsReceived;
