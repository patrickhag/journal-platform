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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckSquare, XCircle, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { RichTextEditor } from '@/components/RichTextEditor';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { DecisionFormData, decisionSchema } from '@/lib/schemas';
import { useSendEditorDecision } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';

interface EditorDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const EditorDecisionModal = ({
  isOpen,
  onClose,
  articleId,
}: EditorDecisionModalProps) => {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      action: undefined,
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
  const fileId = fileIds[0];

  const { mutate, isPending } = useSendEditorDecision(articleId);

  const handleSubmit = (data: DecisionFormData) => {
    const { action, message } = data;
    mutate(
      { decision: action, fileId, message },
      {
        onSettled: () => {
          form.reset();
          onClose();
          clearURL();
        },
      }
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ACCEPT':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'REJECT':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'REQUEST_REVISION':
        return <RotateCcw className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ACCEPT':
        return 'bg-green-600 hover:bg-green-700';
      case 'REJECT':
        return 'bg-red-600 hover:bg-red-700';
      case 'REQUEST_REVISION':
        return 'bg-amber-600 hover:bg-amber-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editorial Decision</DialogTitle>
          <DialogDescription>
            Make an editorial decision for this article. You can accept it for
            publication, request revisions, or reject it.
          </DialogDescription>
        </DialogHeader>
        <p>Annotate files</p>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Editorial Decision</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your decision" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACCEPT">
                        <div className="flex items-center">
                          <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                          Accept for Publication
                        </div>
                      </SelectItem>
                      <SelectItem value="REVISION">
                        <div className="flex items-center">
                          <RotateCcw className="h-4 w-4 text-amber-600 mr-2" />
                          Request Revision
                        </div>
                      </SelectItem>
                      <SelectItem value="REJECT">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          Reject
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={() => (
                <FormItem>
                  <FormLabel>Decision Message</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      description={form.getValues().message}
                      onChange={(d) => {
                        form.setValue('message', d);
                      }}
                      placeholder="Provide feedback and reasoning for your editorial decision..."
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
                className={
                  form.watch('action')
                    ? getActionColor(form.watch('action'))
                    : 'bg-blue-600 hover:bg-blue-700'
                }
                disabled={isPending}
              >
                {form.watch('action') && getActionIcon(form.watch('action'))}
                {isPending ? (
                  <Loader text="Submitting..." />
                ) : (
                  'Submit Decision'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditorDecisionModal;
