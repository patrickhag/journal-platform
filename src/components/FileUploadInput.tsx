'use client';

import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface FileUploadInputProps {
  label: string;
  accept?: string;
  fieldName: string;
  form: UseFormReturn<any>;
  componentTitle: string;
}

export const FileUploadInput = ({
  label,
  accept = '.pdf,.doc,.docx',
  fieldName,
  form,
  componentTitle,
}: FileUploadInputProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    setUploadedFiles(newFiles);
    form.setValue(fieldName, newFiles, { shouldValidate: true });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue(fieldName, newFiles, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <FormLabel>{label}</FormLabel>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileUpload}
          className="hidden"
          id={`${fieldName}-input`}
        />
        <label htmlFor={`${fieldName}-input`} className="cursor-pointer">
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <p className="text-md font-medium text-gray-700 mb-2">
            {componentTitle}
          </p>
          <p className="text-sm text-gray-500">
            Click to select files ({accept.toUpperCase()})
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files:</p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {form.formState.errors[fieldName] && (
        <p className="text-sm text-red-600">
          {form.formState.errors[fieldName]?.message as string}
        </p>
      )}
    </div>
  );
};
