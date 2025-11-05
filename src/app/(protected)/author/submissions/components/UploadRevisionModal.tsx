'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { File, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { useSendAuthorRevision } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';

const revisionSchema = z.object({
  note: z.string().min(20, 'Revision note must be at least 20 characters'),
});

type RevisionFormData = z.infer<typeof revisionSchema>;

interface UploadRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  articleId: string;
  editorActions: Array<{
    editorfileId: string | null;
    decision: string;
    message: string;
  }>;
}

const UploadRevisionModal = ({
  isOpen,
  onClose,
  articleTitle,
  articleId,
  editorActions,
}: UploadRevisionModalProps) => {
  const form = useForm<RevisionFormData>({
    resolver: zodResolver(revisionSchema),
    defaultValues: {
      note: '',
    },
  });

  const searchParams = useSearchParams();
  const clearURL = useClearURL();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const { mutate, isPending } = useSendAuthorRevision(articleId);

  const handleSubmit = (data: RevisionFormData) => {
    mutate(
      { note: data.note, fileIds },
      {
        onSettled: () => {
          form.reset();
          onClose();
          clearURL();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Revision</DialogTitle>
          <DialogDescription>
            Upload your revised manuscript for: <strong>{articleTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        {editorActions.length > 0 && (
          <div className="space-y-6 mb-6">
            {editorActions.map((action, index) => (
              <div
                key={index}
                className="bg-amber-50 border border-amber-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-amber-800 mb-2">
                  Editor Feedback{' '}
                  {editorActions.length > 1 ? `#${index + 1}` : ''}
                </h4>

                <div
                  className="prose max-w-none text-sm text-amber-700"
                  dangerouslySetInnerHTML={{
                    __html: action.message || '',
                  }}
                />

                {action.editorfileId && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      Annotated File
                    </p>
                    <a
                      href={action.editorfileId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:bg-amber-100 border border-amber-300 text-sm font-medium text-amber-900 transition"
                    >
                      <File className="h-4 w-4" />
                      View File
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <p className="font-medium text-sm mb-2">Revised Files *</p>
          <DragAndDropFileInput />
          <FileList isEditNeeded />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revision Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the changes you made in response to the reviews and editor feedback..."
                      className="min-h-[120px]"
                      {...field}
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
                className="bg-green-600 hover:bg-green-700"
                disabled={fileIds.length === 0 || isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isPending ? (
                  <Loader text="Submitting..." />
                ) : (
                  'Submit Revision'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadRevisionModal;
