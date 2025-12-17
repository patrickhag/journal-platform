import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthorReplyStaffEditor } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { filesSchema } from '@/schemas/reviewer';
import { safeParse } from 'zod-urlsearchparams';
import { useSearchParams } from 'next/navigation';
import { useClearURL } from '@/components/ClearURL';

const AuthorReplyModal: React.FC<{
  articleId: string;
  isNotAllowedToReply: boolean;
}> = ({ articleId, isNotAllowedToReply }) => {
  const [reply, setReply] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useAuthorReplyStaffEditor();

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const handleClose = () => {
    setReply('');
    setIsOpen(false);
  };

  const clearURL = useClearURL();

  const handleSubmit = async () => {
    const payloadData = {
      articleId,
      message: reply,
      fileIds,
    };

    mutate(payloadData, {
      onSuccess: () => {
        handleClose();
        clearURL();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isNotAllowedToReply}>
          Reply to Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Attach the corrected file, you can also add optional message.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="reply">Corrected File</Label>
          <DragAndDropFileInput />
          <FileList />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reply">Message</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter your response to the reviewer's comments (Optional)"
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={isPending || !reply.trim()} onClick={handleSubmit}>
            {isPending ? <Loader text="Replying..." /> : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorReplyModal;
