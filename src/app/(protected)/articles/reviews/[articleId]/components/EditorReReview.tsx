import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { RichTextEditor } from '@/components/RichTextEditor';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import {
  DecisionFormData,
  ReReviewFormData,
  reReviewSchema,
} from '@/lib/schemas';
import { useSendReRevision } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';

interface EditorReReviewProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  reviewerName: string;
  reviewerEmail: string;
  articleTitle: string;
  articleId: string;
}

const EditorReReviewModal = ({
  isOpen,
  onClose,
  reviewId,
  reviewerName,
  reviewerEmail,
  articleTitle,
  articleId,
}: EditorReReviewProps) => {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(reReviewSchema),
    defaultValues: {
      message: '',
    },
  });

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const clearURL = useClearURL();

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const { mutate, isPending } = useSendReRevision();

  const handleSubmit = (data: ReReviewFormData) => {
    const { message } = data;
    const payload = {
      message,
      fileIds,
      reviewerName,
      reviewerEmail,
      reviewId,
      articleTitle,
      articleId,
    };

    mutate(payload, {
      onSettled: () => {
        form.reset();
        onClose();
        clearURL();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Re-Review</DialogTitle>
          <DialogDescription>
            Provide details and optionally attach files to request the reviewer
            to re-review this manuscript.
          </DialogDescription>
        </DialogHeader>

        <p className="font-medium">Attach Annotated Files (if any)</p>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="message"
              render={() => (
                <FormItem>
                  <FormLabel>Message to Reviewer</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      description={form.getValues().message}
                      onChange={(d) => {
                        form.setValue('message', d);
                      }}
                      placeholder="Explain the reason for requesting a re-review, highlight any changes made by the author, and provide additional guidance if necessary..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader text="Sending Request..." />
                ) : (
                  'Send Re-Review Request'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditorReReviewModal;
