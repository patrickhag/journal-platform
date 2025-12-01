'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { type FC, type PropsWithChildren, useState, useEffect } from 'react';

const fileTypes = [
  { value: 'Manuscript Text', label: 'Manuscript Text' },
  { value: 'Research Instrument', label: 'Research Instrument' },
  { value: 'Research Materials', label: 'Research Materials' },
  { value: 'Research Results', label: 'Research Results' },
  { value: 'Transcripts', label: 'Transcripts' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Source Texts', label: 'Source Texts' },
  { value: 'Supporting Document', label: 'Supporting Document' },
  { value: 'Other', label: 'Other' },
];

type FileTypeModalProps = {
  currentFileType?: string;
  onSave: (fileType: string) => void;
} & PropsWithChildren;

export const FileTypeModal: FC<FileTypeModalProps> = ({
  children,
  currentFileType,
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(
    currentFileType || fileTypes[0].value
  );

  // Update selectedType when currentFileType changes
  useEffect(() => {
    if (currentFileType) {
      setSelectedType(currentFileType);
    }
  }, [currentFileType]);

  const handleSave = () => {
    onSave(selectedType);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">File types</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose the option that best describes this file.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup
            value={selectedType}
            onValueChange={setSelectedType}
            className="space-y-3"
          >
            {fileTypes.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button type="button" onClick={handleSave} className="mt-4">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
