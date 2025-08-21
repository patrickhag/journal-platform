'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Eye, Calendar, FileText, File } from 'lucide-react';
import { useGetAllCompleted } from '@/hooks/useReviews';

interface CompletedReview {
  id: string;
  articleTitle: string;
  author: string;
  reviewCompletedDate: string;
  recommendation: string;
  reviewText: string;
  comments: string;
  attachedFile: string[];
}

const CompletedReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState('all');
  const [selectedReview, setSelectedReview] = useState<CompletedReview | null>(
    null
  );
  const { data: allReviews } = useGetAllCompleted();

  const completedReviews =
    allReviews?.map((r) => ({
      id: r.id,
      articleTitle: r.article.metadata.title,
      author: `${r.article.metadata.prefix ?? ''} ${r.article.user.firstName} ${r.article.user.lastName}`,
      reviewCompletedDate: r.reviewedAt,
      recommendation: r.status,
      reviewText: r.message ?? '',
      comments: r.article.authorRevisions.message ?? 'N/A',
      attachedFile: r.fileIds ?? 'N/A',
    })) ?? [];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Minor Collection':
        return 'bg-yellow-100 text-yellow-800';
      case 'Major Collection':
        return 'bg-orange-100 text-orange-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReviews = completedReviews.filter((review) => {
    const matchesSearch =
      review.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterRecommendation === 'all' ||
      review.recommendation === filterRecommendation;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Reviews</h1>
        <p className="mt-2 text-gray-600">
          Track and see all reviews you've sent
        </p>
      </div>
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by article title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterRecommendation}
          onValueChange={setFilterRecommendation}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by recommendation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recommendations</SelectItem>
            <SelectItem value="Accepted">Accept</SelectItem>
            <SelectItem value="Minor Collection">Minor Revisions</SelectItem>
            <SelectItem value="Major Collection">Major Revisions</SelectItem>
            <SelectItem value="Rejected">Reject</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-600 font-semibold justify-end">
          Total Reviews: {completedReviews.length}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">
                    {review.articleTitle}
                  </CardTitle>
                  <p className="text-sm text-gray-600">by {review.author}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    className={getRecommendationColor(review.recommendation)}
                  >
                    {review.recommendation}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Reviewed:{' '}
                  {new Date(review.reviewCompletedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700 line-clamp-2 flex-1 mr-4">
                  {review.reviewText}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedReview?.articleTitle}</DialogTitle>
                    </DialogHeader>
                    {selectedReview && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Author
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedReview.author}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Recommendation
                            </p>
                            <Badge
                              className={getRecommendationColor(
                                selectedReview.recommendation
                              )}
                            >
                              {selectedReview.recommendation}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Review Completed
                            </p>
                            <p className="text-sm text-gray-900">
                              {new Date(
                                selectedReview.reviewCompletedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-3">Review</h4>
                          <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {selectedReview.reviewText}
                            </p>
                          </div>
                        </div>
                        <div>
                          {selectedReview.attachedFile &&
                            selectedReview.attachedFile.length > 0 && (
                              <>
                                <h4 className="text-lg font-semibold mb-3">
                                  Annotated File
                                </h4>
                                <div>
                                  <div className="space-y-2">
                                    {selectedReview.attachedFile.map(
                                      (fileUrl, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3"
                                        >
                                          <div className="flex items-center gap-3">
                                            <File className="h-4 w-4 text-green-500" />
                                            <div>
                                              <h5 className="text-sm font-medium">
                                                File {idx + 1}
                                              </h5>
                                            </div>
                                          </div>
                                          <div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              asChild
                                            >
                                              <a href={fileUrl} download>
                                                <Eye className="h-4 w-4" />
                                              </a>
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-3">
                            Comments of Author
                          </h4>
                          <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {selectedReview.comments}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No reviews found</p>
          <p className="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedReviews;
