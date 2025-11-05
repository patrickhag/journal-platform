'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/file-upload';
import { CollectionFormValues, collectionSchema } from '@/lib/schemas';
import { useEditCollection } from '@/hooks/useCollections';
import Loader from '@/components/Loader';
import { TCollections } from '@/types';
import { sdgGoals } from '@/lib/consts';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UndoIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: TCollections;
}

export function EditCollectionModal({
  isOpen,
  onClose,
  collection,
}: EditCollectionModalProps) {
  const defaultValues: CollectionFormValues = {
    title: collection.title,
    description: collection.description,
    objective: collection.objective,
    sdgGoal: collection.sdgGoal,
    isFeatured: collection.isFeatured,
    thumbnailUrl: collection.thumbnailUrl,
  };

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues,
  });

  const { mutate, isPending } = useEditCollection(collection.id);

  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(
    new Set()
  );

  const handleToggleArticle = (articleId: string) => {
    const updated = new Set(markedForDeletion);
    if (updated.has(articleId)) {
      updated.delete(articleId);
    } else {
      updated.add(articleId);
    }
    setMarkedForDeletion(updated);
  };

  const onSubmit = (data: CollectionFormValues) => {
    const payload = {
      ...data,
      removedArticles: Array.from(markedForDeletion),
      thumbnailUrl: data.thumbnailUrl,
    };
    mutate(payload, {
      onSettled: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Basic Fields --- */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Describe this collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Goal of this collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sdgGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    SDG Goal <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SDG Goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sdgGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thumbnail URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Featured Collection</FormLabel>
                </FormItem>
              )}
            />

            {/* --- Article List with Removal Logic --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Articles</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {collection.collectionArticles.length} articles (
                  {markedForDeletion.size} marked for removal)
                </span>
              </div>
              <Separator />
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {collection.collectionArticles.map(
                    ({ articleId, articleSubmission }) => (
                      <div
                        key={articleId}
                        className={`flex items-center justify-between bg-muted/50 rounded-lg p-4 relative transition-colors ${
                          markedForDeletion.has(articleId)
                            ? 'bg-red-50 border border-red-200'
                            : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium">
                            {articleSubmission.metadata.title}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            {articleSubmission.articleStatus} •{' '}
                            {articleSubmission.user.firstName}{' '}
                            {articleSubmission.user.lastName}
                          </div>
                        </div>
                        {markedForDeletion.has(articleId) && (
                          <span className="absolute top-2 right-12 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Will be removed
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleToggleArticle(articleId)}
                        >
                          {markedForDeletion.has(articleId) ? (
                            <UndoIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <XIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* --- Submit Buttons --- */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader text="Updating..." />
                ) : (
                  'Update Collection'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
