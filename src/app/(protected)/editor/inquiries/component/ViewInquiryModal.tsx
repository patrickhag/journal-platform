import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ViewInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact' | 'feedback';
  data: any;
}

const ViewInquiryModal: React.FC<ViewInquiryModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === 'contact' ? 'Contact Inquiry' : 'Feedback Submission'}
          </DialogTitle>
          <DialogDescription>
            Full details of the selected {type}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {type === 'contact' && (
            <>
              <p>
                <strong>Name:</strong> {`${data.firstName} ${data.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              {data.institution && (
                <p>
                  <strong>Institution:</strong> {data.institution}
                </p>
              )}
              <p>
                <strong>Subject:</strong> {data.subject}
              </p>
              <p>
                <strong>Message:</strong> {data.message}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </>
          )}

          {type === 'feedback' && (
            <>
              <p>
                <strong>Name:</strong> {data.name || 'No name provided'}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Type:</strong> {data.feedbackType}
              </p>
              <p>
                <strong>Rating:</strong>{' '}
                {data.rating ? `⭐`.repeat(parseInt(data.rating)) : 'N/A'}
              </p>
              <p>
                <strong>Message:</strong> {data.feedbackMessage}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInquiryModal;
