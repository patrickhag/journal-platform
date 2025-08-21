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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, CheckCircle } from 'lucide-react';
import { useAssignEditor, useGetEditors } from '@/hooks/useUsers';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loader from '@/components/Loader';

interface AssignEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

export default function AssignEditorModal({
  isOpen,
  onClose,
  articleId,
}: AssignEditorModalProps) {
  const [selectedEditorId, setSelectedEditorId] = useState<string>('');
  const { data: availableEditors } = useGetEditors();
  console.log('availableEditors:', availableEditors);
  const { mutate, isPending } = useAssignEditor();

  const selectedEditor = availableEditors?.find(
    (editor) => editor.id === selectedEditorId
  );

  const handleAssign = () => {
    if (selectedEditor) {
      const data = {
        articleId,
        userId: selectedEditor.id,
        editorName: `${selectedEditor.firstName} ${selectedEditor.lastName}`,
        editorEmail: selectedEditor.email as string,
      };
      mutate(data, {
        onSettled: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assign Editor to Manuscript
          </DialogTitle>
          <DialogDescription>
            Select an editor to handle the review process for this manuscript.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Select Editor</h3>

            {availableEditors?.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No editors available.
              </div>
            ) : (
              <>
                <Select
                  value={selectedEditorId}
                  onValueChange={setSelectedEditorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an editor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEditors?.map((editor) => (
                      <SelectItem key={editor.id} value={editor.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {editor.firstName} {editor.lastName}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEditor && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <strong className="text-blue-800">Selected Editor</strong>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedEditor.firstName}{' '}
                        {selectedEditor.lastName}
                      </p>
                      <p>
                        <strong>Affiliation:</strong>{' '}
                        {selectedEditor.affiliation}
                      </p>
                      <p>
                        <strong>Bio:</strong>{' '}
                        {selectedEditor.bio?.slice(0, 120)}...
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Editor List (Optional) */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">All Available Editors</h4>
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {availableEditors?.map((editor) => (
                  <div
                    key={editor.id}
                    className={`flex justify-between items-center p-2 rounded border ${
                      editor.id === selectedEditorId
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {editor.firstName} {editor.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{editor.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">ORCID</p>
                      <a
                        href={editor.orcid as string}
                        className="text-xs text-gray-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {editor.orcid}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEditorId || isPending}
          >
            {isPending ? <Loader text="Assigning..." /> : 'Assign Editor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
