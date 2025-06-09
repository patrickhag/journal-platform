import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthorCommunicationModal } from './AuthorCommunicationModal';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAffiliation: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  submittedDate?: string;
  recommendation:
    | 'accept'
    | 'minor_revision'
    | 'major_revision'
    | 'reject'
    | null;
  comments: string;
  confidentialComments: string;
  rating: number | null;
}

interface ManuscriptReviewPageProps {
  manuscriptId: string;
  onBack: () => void;
}

const mockReviews: Review[] = [
  {
    id: 'REV-001',
    reviewerName: 'Dr. Alice Thompson',
    reviewerAffiliation: 'Stanford University',
    status: 'completed',
    submittedDate: '2024-02-15',
    recommendation: 'minor_revision',
    rating: 7,
    comments:
      'This paper presents a novel approach to machine learning in climate prediction. The methodology is sound and the results are promising. However, there are several areas that need improvement:\n\n1. The literature review could be more comprehensive\n2. Statistical significance testing should be included\n3. Figure 3 needs better resolution\n\nOverall, this is a solid contribution that would benefit from minor revisions.',
    confidentialComments:
      'The authors seem inexperienced but the work has merit. I recommend acceptance after minor revisions.',
  },
  {
    id: 'REV-002',
    reviewerName: 'Prof. Robert Chen',
    reviewerAffiliation: 'MIT',
    status: 'completed',
    submittedDate: '2024-02-18',
    recommendation: 'minor_revision',
    rating: 8,
    comments:
      'Excellent research with practical implications. The experimental design is well thought out and the analysis is thorough. Minor suggestions:\n\n- Expand the discussion on limitations\n- Include comparison with recent baseline models\n- Clarify the data preprocessing steps\n\nI recommend publication after addressing these minor points.',
    confidentialComments:
      'Strong paper from experienced researchers. Should be accepted.',
  },
  {
    id: 'REV-003',
    reviewerName: 'Dr. Maria Santos',
    reviewerAffiliation: 'Oxford University',
    status: 'in_progress',
    submittedDate: undefined,
    recommendation: null,
    rating: null,
    comments: '',
    confidentialComments: '',
  },
  {
    id: 'REV-004',
    reviewerName: 'Prof. James Wilson',
    reviewerAffiliation: 'Harvard University',
    status: 'pending',
    submittedDate: undefined,
    recommendation: null,
    rating: null,
    comments: '',
    confidentialComments: '',
  },
];

export const ManuscriptReviewPage = ({
  manuscriptId,
  onBack,
}: ManuscriptReviewPageProps) => {
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const manuscript = {
    id: manuscriptId,
    title:
      'Machine Learning Approaches for Climate Change Prediction: A Comprehensive Analysis',
    authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Lisa Rodriguez'],
    submittedDate: '2024-01-15',
    abstract:
      'This study presents a comprehensive analysis of machine learning approaches for climate change prediction. We evaluate multiple algorithms including neural networks, random forests, and support vector machines on a large dataset of climate variables spanning 50 years. Our results demonstrate that ensemble methods achieve the highest accuracy with an R² of 0.89 for temperature predictions and 0.82 for precipitation forecasting.',
    keywords: [
      'Machine Learning',
      'Climate Change',
      'Prediction Models',
      'Ensemble Methods',
    ],
    status: 'under_review',
  };

  const completedReviews = mockReviews.filter((r) => r.status === 'completed');

  const getRecommendationSummary = () => {
    const recommendations = completedReviews
      .map((r) => r.recommendation)
      .filter(Boolean);
    const counts = recommendations.reduce((acc: any, rec) => {
      acc[rec!] = (acc[rec!] || 0) + 1;
      return acc;
    }, {});

    return {
      accept: counts.accept || 0,
      minor_revision: counts.minor_revision || 0,
      major_revision: counts.major_revision || 0,
      reject: counts.reject || 0,
    };
  };

  const recommendationSummary = getRecommendationSummary();
  const averageRating =
    completedReviews.length > 0
      ? completedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        completedReviews.length
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" onClick={onBack}>
              ← Back to Dashboard
            </Button>
            <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {manuscript.title}
          </h1>
          <p className="text-slate-600 mt-1">
            {manuscript.authors.join(', ')} • Submitted{' '}
            {new Date(manuscript.submittedDate).toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Main Content - Two-Column Layout Following Wireframe */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Review List */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>REVIEWS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-auto max-h-[calc(100vh-200px)]">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedReview?.id === review.id ? 'border-primary bg-slate-100' : 'border-slate-200 hover:bg-slate-50'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-slate-900">
                        {review.reviewerName}
                      </h3>
                      <Badge
                        className={
                          review.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : review.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                        }
                      >
                        {review.status
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      {review.reviewerAffiliation}
                    </p>
                    {review.recommendation && (
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className={
                            review.recommendation === 'accept'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : review.recommendation === 'minor_revision'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : review.recommendation === 'major_revision'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {review.recommendation
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Review Details */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[calc(100vh-200px)]">
                {selectedReview ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {selectedReview.reviewerName}
                        </h2>
                        <p className="text-slate-600">
                          {selectedReview.reviewerAffiliation}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            selectedReview.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : selectedReview.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedReview.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }
                        >
                          {selectedReview.status
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        {selectedReview.submittedDate && (
                          <span className="text-xs text-slate-500">
                            Submitted:{' '}
                            {new Date(
                              selectedReview.submittedDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedReview.status === 'completed' ? (
                      <>
                        {/* Recommendation and Rating */}
                        <div className="grid grid-cols-2 gap-4">
                          {selectedReview.recommendation && (
                            <div>
                              <p className="text-sm font-medium text-slate-600 mb-1">
                                Recommendation
                              </p>
                              <Badge
                                className={
                                  selectedReview.recommendation === 'accept'
                                    ? 'bg-green-100 text-green-800'
                                    : selectedReview.recommendation ===
                                        'minor_revision'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : selectedReview.recommendation ===
                                          'major_revision'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-red-100 text-red-800'
                                }
                              >
                                {selectedReview.recommendation
                                  .replace('_', ' ')
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Badge>
                            </div>
                          )}
                          {selectedReview.rating && (
                            <div>
                              <p className="text-sm font-medium text-slate-600 mb-1">
                                Rating
                              </p>
                              <p className="font-medium">
                                {selectedReview.rating}/10
                                <span className="text-yellow-500 ml-2">
                                  {'★'.repeat(
                                    Math.floor(selectedReview.rating / 2)
                                  )}
                                </span>
                                <span className="text-slate-300">
                                  {'★'.repeat(
                                    5 - Math.floor(selectedReview.rating / 2)
                                  )}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Comments */}
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">
                            Comments for Authors
                          </h3>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-slate-700 whitespace-pre-line">
                              {selectedReview.comments}
                            </p>
                          </div>
                        </div>

                        {/* Confidential Comments */}
                        {selectedReview.confidentialComments && (
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-2">
                              Confidential Comments for Editor
                            </h3>
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                              <p className="text-slate-700 whitespace-pre-line">
                                {selectedReview.confidentialComments}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-lg text-center">
                        <p className="text-slate-600">
                          {selectedReview.status === 'in_progress'
                            ? 'Review in progress... Check back later for comments.'
                            : selectedReview.status === 'overdue'
                              ? 'Review is overdue. Consider sending a reminder to the reviewer.'
                              : 'Review is pending. Waiting for reviewer to start.'}
                        </p>
                        {selectedReview.status === 'overdue' && (
                          <Button variant="outline" size="sm" className="mt-4">
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Action Buttons for Completed Reviews */}
                    {selectedReview.status === 'completed' && (
                      <div className="pt-4 border-t border-slate-200">
                        <Button onClick={() => setShowCommunicationModal(true)}>
                          Send Decision to Author
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-slate-500 mb-2">
                      Select a review from the left to see details
                    </p>
                    <p className="text-slate-400 text-sm">No review selected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decision Summary Card - Fixed at Bottom */}
        <div className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">
                    Reviews Completed
                  </p>
                  <p className="text-xl font-bold">
                    {completedReviews.length}/{mockReviews.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Average Rating</p>
                  <p className="text-xl font-bold">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Recommendations</p>
                  <div className="flex gap-2">
                    {recommendationSummary.accept > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        Accept: {recommendationSummary.accept}
                      </Badge>
                    )}
                    {recommendationSummary.minor_revision > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Minor: {recommendationSummary.minor_revision}
                      </Badge>
                    )}
                    {recommendationSummary.major_revision > 0 && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Major: {recommendationSummary.major_revision}
                      </Badge>
                    )}
                    {recommendationSummary.reject > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        Reject: {recommendationSummary.reject}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowCommunicationModal(true)}
                disabled={completedReviews.length === 0}
              >
                Send Decision to Author
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Communication Modal */}
      <AuthorCommunicationModal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        manuscript={manuscript}
        reviews={completedReviews}
      />
    </div>
  );
};
