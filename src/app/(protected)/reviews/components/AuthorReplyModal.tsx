import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReviewersReview } from '@/types';
import { useAuthorReplyReviewer } from '@/hooks/useReviews';
import Loader from '@/components/Loader';

interface AuthorReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewersReview;
  manuscriptTitle: string;
}

const AuthorReplyModal: React.FC<AuthorReplyModalProps> = ({
  isOpen,
  onClose,
  review,
  manuscriptTitle,
}) => {
  const [reply, setReply] = useState('');

  const getReviewerName = (review: ReviewersReview) => {
    if (review.user) {
      const { firstName, lastName, prefix } = review.user;
      return `${prefix ? prefix + ' ' : ''}${firstName} ${lastName}`;
    }
    return 'Unknown Reviewer';
  };

  const reviewerName = review.user.firstName + ' ' + review.user.lastName;
  const { mutate, isPending } = useAuthorReplyReviewer();

  const handleSubmit = async () => {
    const payloadData = {
      reviewerId: review.user.id,
      articleId: review.articleId,
      message: reply,
      reviewerEmail: review.user.email,
      reviewerName,
      articleTitle: manuscriptTitle,
    };

    mutate(payloadData, {
      onSettled: () => {
        onClose();
      },
    });
  };

  const handleClose = () => {
    setReply('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Responding to {getReviewerName(review)}&apos;s review for &quot;
            {manuscriptTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter your response to the reviewer's comments..."
              rows={6}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !reply.trim()}>
            {isPending ? <Loader text="Replying..." /> : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorReplyModal;
