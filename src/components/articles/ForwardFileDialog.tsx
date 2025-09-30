'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Forward, Send } from 'lucide-react';
import { useTransferFileToPublished } from '@/hooks/useUploadFiles';
import Loader from '../Loader';

interface ForwardFileModalProps {
  fileName: string;
  articleId: string;
}

const ForwardFileModal = ({ fileName, articleId }: ForwardFileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<string>('publish');

  const { mutate: transferFileToPublished, isPending: isForwarding } =
    useTransferFileToPublished();

  const handleForward = () => {
    transferFileToPublished({ fileId: fileName, articleId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Forward className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forward File for Action</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Forward for Action *</Label>
            <Select onValueChange={setAction} value={action}>
              <SelectTrigger>
                <SelectValue placeholder="Select action required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publish">Publishing Preparation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isForwarding}
            >
              Cancel
            </Button>
            <Button disabled={isForwarding || !action} onClick={handleForward}>
              {isForwarding ? (
                <Loader text="Forwarding..." />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Forward for Action
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardFileModal;
