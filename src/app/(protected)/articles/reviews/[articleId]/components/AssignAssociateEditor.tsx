'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, CheckCircle, CalendarIcon } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  useAssignAssociateEditor,
  useGetAssociateEditors,
} from '@/hooks/useReviews';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';
import { useSession } from 'next-auth/react';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { Textarea } from '@/components/ui/textarea';

export default function AssignAssociateEditor({
  open,
  setOpen,
  articleTitle,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  articleTitle: string;
}) {
  const [selectedEditorId, setSelectedEditorId] = useState<string>('');
  const { mutate, isPending } = useAssignAssociateEditor();
  const [date, setDate] = useState<Date>();
  const [warning, setWarning] = useState<string>('');
  const { data: associateEditors } = useGetAssociateEditors();
  associateEditors;
  const [message, setMessage] = useState('');

  const { articleId } = useParams();

  const { data: session } = useSession();

  const staffEditorId = session?.user.id;

  const selectedEditor = associateEditors?.find(
    (editor) => editor.id === selectedEditorId
  );

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const clearUrl = useClearURL();

  const handleAssign = () => {
    if (!date) {
      setWarning('Please select a due date before assigning');
      return;
    }

    if (selectedEditor) {
      const data = {
        articleId: articleId as string,
        userId: selectedEditor.user.id,
        editorName: `${selectedEditor.user.firstName} ${selectedEditor.user.lastName}`,
        editorEmail: selectedEditor.user.email as string,
        date,
        articleTitle,
        staffEditorId: staffEditorId as string,
        fileIds,
        message,
      };

      mutate(data, {
        onSettled: () => {
          setOpen(false);
          clearUrl();
          setWarning('');
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assign Associate Editor
          </DialogTitle>
          <DialogDescription>
            Select an associate editor to edit this manuscript.
          </DialogDescription>
        </DialogHeader>

        {/* Files Section */}
        <div className="space-y-4 mb-6">
          <p className="font-semibold">Attach Files</p>
          <DragAndDropFileInput />
          <FileList isEditNeeded={true} />
        </div>

        {/* Editors Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Select Associate Editor</h3>

            {associateEditors?.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No associate editors available.
              </div>
            ) : (
              <>
                <Select
                  value={selectedEditorId}
                  onValueChange={setSelectedEditorId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Choose an associate editor..."
                      defaultValue=""
                    >
                      {selectedEditor
                        ? `${selectedEditor.user.firstName} ${selectedEditor.user.lastName}`
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {associateEditors?.map((editor) => (
                      <SelectItem key={editor.id} value={editor.id}>
                        {editor.user.firstName} {editor.user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEditor && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <strong className="text-blue-800">
                        Selected Associate Editor
                      </strong>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedEditor.user.firstName}{' '}
                        {selectedEditor.user.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedEditor.user.email}
                      </p>
                      <p>
                        <strong>Affiliation:</strong>{' '}
                        {selectedEditor.user.affiliation ?? 'N/A'}
                      </p>
                      <p>
                        <strong>Bio:</strong>{' '}
                        {selectedEditor.user.bio?.slice(0, 120)}...
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {warning && <p className="text-sm text-red-500">{warning}</p>}

        {/* Due Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2" />
              {date ? format(date, 'PPP') : <span>Add due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Textarea
          placeholder="You can also send a message to associate-editor here. (optional)"
          className="h-20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEditorId || isPending}
          >
            {isPending ? (
              <Loader text="Assigning..." />
            ) : (
              'Assign Associate Editor'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
