'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Upload } from 'lucide-react';
import { useGetReviews } from '@/hooks/useReviews';

interface ReviewAssignment {
  id: string;
  articleTitle: string;
  author: string;
  assignedDate: string;
  dueDate: string;
  status: string;
  roundNumber: number;
  daysRemaining: number;
}

const ReviewerDashboard = () => {
  const [assignments] = useState<ReviewAssignment[]>([
    {
      id: '1',
      articleTitle:
        'Machine Learning Applications in Healthcare: A Systematic Review',
      author: 'Dr. Jane Smith',
      assignedDate: '2024-01-20',
      dueDate: '2024-02-10',
      status: 'invited',
      roundNumber: 1,
      daysRemaining: 5,
    },
    {
      id: '2',
      articleTitle: 'Blockchain Technology in Supply Chain Management',
      author: 'Prof. John Doe',
      assignedDate: '2024-01-15',
      dueDate: '2024-02-05',
      status: 'in_progress',
      roundNumber: 1,
      daysRemaining: -2,
    },
    {
      id: '3',
      articleTitle: 'Sustainable Energy Solutions for Urban Development',
      author: 'Dr. Maria Garcia',
      assignedDate: '2024-01-10',
      dueDate: '2024-01-30',
      status: 'completed',
      roundNumber: 2,
      daysRemaining: -3,
    },
  ]);

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    assignmentId: '',
    articleTitle: '',
  });

  const handleSubmitReview = (assignmentId: string, articleTitle: string) => {
    setReviewModal({
      isOpen: true,
      assignmentId,
      articleTitle,
    });
  };

  // const { data: assignmentso } = useGetReviews()

  const handleReviewSubmit = (data: any) => {
    console.log('Review submitted:', data);
    setReviewModal({ isOpen: false, assignmentId: '', articleTitle: '' });
  };

  const pendingAssignments = assignments.filter((a) => a.status === 'invited');
  const activeAssignments = assignments.filter(
    (a) => a.status === 'in_progress'
  );

  const getUrgencyColor = (daysRemaining: number, status: string) => {
    if (status === 'completed') return '!bg-green-100 !text-green-800';
    if (daysRemaining < 0) return '!bg-red-100 !text-red-800';
    if (daysRemaining <= 3) return '!bg-amber-100 !text-amber-800';
    return '!bg-blue-100 !text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Review Assignments</h1>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Current Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {assignment.articleTitle}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-3">by {assignment.author}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>
                        Assigned:{' '}
                        {new Date(assignment.assignedDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* <Badge status={assignment.status} type="review" /> */}
                      <Badge>{assignment.status}</Badge>

                      <Badge
                        className={getUrgencyColor(
                          assignment.daysRemaining,
                          assignment.status
                        )}
                      >
                        {assignment.status === 'completed'
                          ? 'Submitted'
                          : assignment.daysRemaining < 0
                            ? `${Math.abs(assignment.daysRemaining)} days overdue`
                            : assignment.daysRemaining === 0
                              ? 'Due today'
                              : `${assignment.daysRemaining} days remaining`}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Article
                    </Button>

                    {assignment.status === 'in_progress' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          handleSubmitReview(
                            assignment.id,
                            assignment.articleTitle
                          )
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* <SubmitReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, assignmentId: '', articleTitle: '' })}
        articleTitle={reviewModal.articleTitle}
        onSubmit={handleReviewSubmit}
      /> */}
    </div>
  );
};

export default ReviewerDashboard;
