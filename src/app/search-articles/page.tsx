'use client';

import { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  CalendarIcon,
  FileX,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetSearchedArticles } from '@/hooks/useGetSearchedArticles';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchArticleCardSkeleton } from '@/components/skeletons/SearchArticleCardSkeleton';
import Link from 'next/link';

const searchFormSchema = z.object({
  searchQuery: z.string().optional(),
  title: z.string().optional(),
  keywords: z.string().optional(),
  author: z.string().optional(),
  affiliation: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const Search = () => {
  const [submittedFilters, setSubmittedFilters] = useState<SearchFormValues>(
    {}
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchQuery: '',
      title: '',
      keywords: '',
      author: '',
      affiliation: '',
      fromDate: undefined,
      toDate: undefined,
      volume: '',
      issue: '',
    },
  });

  // Watch searchQuery for real-time search
  const searchQuery = form.watch('searchQuery');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update submitted filters when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setSubmittedFilters((prev) => {
        const newFilters = { ...prev };
        if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
          newFilters.searchQuery = debouncedSearchQuery.trim();
        } else {
          // Remove searchQuery if empty
          const { searchQuery: _, ...rest } = newFilters;
          return rest;
        }
        return newFilters;
      });
    }
  }, [debouncedSearchQuery]);

  const { data: foundArticles = [], isPending } =
    useGetSearchedArticles(submittedFilters);

  const onSubmit = (data: SearchFormValues) => {
    // Remove empty or undefined values
    const cleanedFilters: SearchFormValues = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        if (value === '' || value === undefined || value === null) {
          return false;
        }
        return true;
      })
    ) as SearchFormValues;

    setSubmittedFilters(cleanedFilters);
  };

  const handleReset = () => {
    form.reset();
    setSubmittedFilters({});
  };

  return (
    <>
      <div className="flex gap-8">
        {/* Main Search Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
            <p className="text-muted-foreground">
              Find articles, research papers, and publications
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Search Bar */}
              <div className="relative mb-8">
                <FormField
                  control={form.control}
                  name="searchQuery"
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        placeholder="Enter article title..."
                        {...field}
                        className="h-12 text-base pr-24 border-2 focus:border-academic-blue"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-12 top-1 h-10 w-10 hover:bg-transparent"
                          onClick={() => {
                            field.onChange('');
                            form.setValue('searchQuery', '');
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                      )}
                    </>
                  )}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1 h-10 w-10"
                  onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Advanced Filters */}
              <Collapsible
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
                className="bg-card border border-border rounded-lg mb-8 shadow-sm"
              >
                <div className="p-6 pb-4">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        Advanced Filters
                      </h3>
                      {isFiltersOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Title Filter */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Search in title..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Keywords Filter */}
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Keywords (SEO)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Search in keywords..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Author Name */}
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Author Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter author name..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Author Affiliations */}
                    <FormField
                      control={form.control}
                      name="affiliation"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Author Affiliation</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter institution or affiliation..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Publication Date From */}
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Publication Date From</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  type="button"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Select start date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    {/* Publication Date To */}
                    <FormField
                      control={form.control}
                      name="toDate"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Publication Date To</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  type="button"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Select end date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    {/* Volume */}
                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Volume</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select volume" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  Volume {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Issue */}
                    <FormField
                      control={form.control}
                      name="issue"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Issue</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  Issue {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        Reset Filters
                      </Button>
                      <Button
                        type="submit"
                        variant="secondary"
                        className="flex-1"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </form>
          </Form>

          {/* Search Results */}
          {Object.keys(submittedFilters).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Search Results
              </h2>

              {isPending ? (
                <SearchArticleCardSkeleton count={5} />
              ) : foundArticles.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="text-muted-foreground">
                    <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      No articles found
                    </h3>
                    <p className="text-sm">
                      Try adjusting your search terms or filters to find what
                      you're looking for.
                    </p>
                  </div>
                </div>
              ) : (
                foundArticles.map((result) => {
                  const articleData = result?.article;

                  const author = {
                    name: `${articleData?.user.firstName} ${articleData?.user.lastName}`,
                  };

                  const contributors = articleData
                    ? [author, ...articleData.contributors]
                    : [];

                  return (
                    <div key={result.id}>
                      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow mb-3">
                        <Link
                          href={`/articles/article/${result.slug}`}
                          target="_blank"
                        >
                          <h3 className="text-lg font-medium hover:text-blue-600 cursor-pointer mb-2 line-clamp-1">
                            {result.article.metadata.title}
                          </h3>
                        </Link>
                        <div className="space-x-2 text-muted-foreground mb-2">
                          {contributors.map((contributor, index) => (
                            <span key={index}>
                              {contributor.name}
                              {contributors.indexOf(contributor) !==
                                contributors.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Published on:{' '}
                            {format(
                              new Date(result?.publishedAt as string),
                              'dd-MM-yyyy'
                            )}
                          </span>
                          <Link
                            href={`/articles/article/${result.slug}`}
                            target="_blank"
                          >
                            <Button variant="outline" size="sm">
                              View Article
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
