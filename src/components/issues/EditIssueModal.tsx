import { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { XIcon, CalendarIcon, UndoIcon } from 'lucide-react';
import { issueSchema, type IssueType } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Issue, VolumeType } from '@/types';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EditIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IssueType & { articles: string[] }) => void;
  issue: Issue;
  volumes: VolumeType;
}

export function EditIssueModal({
  open,
  onOpenChange,
  onSubmit,
  issue,
  volumes,
}: EditIssueModalProps) {
  const form = useForm<IssueType & { articles: string[] }>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      issueNumber: issue.issueNumber,
      volumeId: issue.volumeId,
      title: issue.title,
      description: issue.description,
      publicationDate: new Date(issue.publicationDate ?? Date.now()),
      status: issue.status as 'Draft' | 'Published',
      articles: issue.articles.map((a) => a.id),
    },
  });
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(
    new Set()
  );

  const handleArticleToggle = (articleId: string) => {
    const newMarkedForDeletion = new Set(markedForDeletion);
    if (newMarkedForDeletion.has(articleId)) {
      newMarkedForDeletion.delete(articleId);
    } else {
      newMarkedForDeletion.add(articleId);
    }
    setMarkedForDeletion(newMarkedForDeletion);

    // Update form values with filtered articles
    const currentArticles = issue.articles
      .filter((article) => !newMarkedForDeletion.has(article.id))
      .map((article) => article.id);

    form.setValue('articles', currentArticles);
  };

  const handleSubmit = (data: IssueType & { articles: string[] }) => {
    // Combine form data with marked for deletion info
    const formData = {
      ...data,
      removedArticles: Array.from(markedForDeletion),
    };

    onSubmit(formData);
    setMarkedForDeletion(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issueNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="volumeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select volume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {volumes.map((volume) => (
                          <SelectItem key={volume.id} value={volume.id}>
                            Volume {volume.volumeNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publicationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Publication Date</FormLabel>
                  <div className="flex w-full flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Articles</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {issue.articles.length} articles ({markedForDeletion.size}{' '}
                  marked for removal)
                </span>
              </div>
              <Separator />
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {issue.articles.map((article) => (
                    <div
                      key={article.id}
                      className={`flex items-center justify-between bg-muted/50 rounded-lg p-4 relative transition-colors ${
                        markedForDeletion.has(article.id)
                          ? 'bg-red-50 border border-red-200'
                          : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          {article.metadata.title}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          {article.section} •{' '}
                          {article.user.firstName + article.user.lastName}
                        </div>
                      </div>
                      {markedForDeletion.has(article.id) && (
                        <span className="absolute top-2 right-12 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                          Will be removed
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleArticleToggle(article.id)}
                      >
                        {markedForDeletion.has(article.id) ? (
                          <UndoIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <XIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
