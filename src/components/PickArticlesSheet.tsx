'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { CloudUpload, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Loader from './Loader';
import { useQueryClient } from '@tanstack/react-query';

type Article = {
  id: string | null;
  title: string | null;
};

interface PickArticlesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articles: Article[];
}

export function PickArticlesSheet({
  open,
  onOpenChange,
  articles,
}: PickArticlesSheetProps) {
  const queryClient = useQueryClient();
  const [articleImages, setArticleImages] = useState<
    Record<string, File[] | null>
  >({});

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      articleIds: string[];
      images: Record<string, string>;
    }) => {
      return axios.post<{ message: string }>(
        '/api/articles/editors-pick',
        data
      );
    },
    onSuccess: ({ data }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['editorsPick'] });
      setArticleImages({});
      onOpenChange(false);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      toast.error(message || 'Failed to pick articles');
    },
  });

  const handleImageChange = (articleId: string, files: File[] | null) => {
    setArticleImages((prev) => ({
      ...prev,
      [articleId]: files,
    }));
  };

  const handleSubmit = async () => {
    // First, upload all images
    const imageUrls: Record<string, string> = {};

    for (const article of articles) {
      const articleId = article.id;
      if (!articleId) continue;

      const files = articleImages[articleId];
      if (files && files.length > 0) {
        try {
          const formData = new FormData();
          formData.append('files', files[0]);

          const response = await axios.post<
            Array<{ url: string; pathname: string }>
          >('/api/files', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data && response.data.length > 0) {
            imageUrls[articleId] = response.data[0].url;
          }
        } catch (error) {
          toast.error(
            `Failed to upload image for article: ${article.title || articleId}`
          );
          return;
        }
      }
    }

    // Then submit all articles with their images
    const articleIds = articles
      .map((article) => article.id)
      .filter((id): id is string => id !== null);

    mutate({ articleIds, images: imageUrls });
  };

  const allImagesUploaded = articles.every((article) => {
    const articleId = article.id;
    if (!articleId) return false;
    return articleImages[articleId] && articleImages[articleId]!.length > 0;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle>Pick Articles for Editor&apos;s Pick</SheetTitle>
          <SheetDescription>
            Upload an image for each article to feature on the landing page. All
            articles must have an image before submitting.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-6">
          {articles.map((article) => {
            const articleId = article.id;
            if (!articleId) return null;

            const files = articleImages[articleId] || null;
            const hasImage = files && files.length > 0;

            return (
              <div
                key={articleId}
                className="border rounded-lg p-4 space-y-4 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {article.title || 'Untitled Article'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Article ID: {articleId}
                    </p>
                  </div>
                  {hasImage && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <span>✓ Image uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Article Picture <span className="text-red-500">*</span>
                  </p>
                  <FileUploader
                    value={files}
                    onValueChange={(newFiles) =>
                      handleImageChange(articleId, newFiles)
                    }
                    dropzoneOptions={{
                      maxFiles: 1,
                      maxSize: 5 * 1024 * 1024, // 5MB
                      multiple: false,
                      accept: {
                        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                      },
                    }}
                    className="bg-white"
                  >
                    <FileInput className="outline-dashed outline-1 outline-gray-300 hover:outline-blue-500 transition-colors">
                      <div className="flex items-center justify-center flex-col p-6 w-full">
                        <CloudUpload className="text-gray-400 w-8 h-8 mb-2" />
                        <p className="mb-1 text-sm text-gray-600">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </FileInput>
                  </FileUploader>

                  {hasImage && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm text-green-700">
                          {files[0].name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-auto"
                          onClick={() => handleImageChange(articleId, null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {articles.length} article{articles.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || !allImagesUploaded}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <Loader text="Picking articles..." />
              ) : (
                'Pick Articles'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
