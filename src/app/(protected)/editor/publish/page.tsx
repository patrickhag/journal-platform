'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AcceptedManuscript {
  id: string;
  title: string;
  author: string;
  acceptedDate: string;
  abstract: string;
  status: 'ACCEPTED';
}

interface PublishedArticle {
  id: string;
  articleId: string;
  issueId?: string;
  doi?: string;
  status: string;
  publishedAt: string;
  pageRange?: string;
  pdfUrl: string;
  keywords?: string[];
  title: string;
  author: string;
}

interface Issue {
  id: string;
  name: string;
  volume: number;
  number: number;
  year: number;
}

const PublishedArticles = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedManuscript, setSelectedManuscript] =
    useState<AcceptedManuscript | null>(null);
  const [editingArticle, setEditingArticle] = useState<PublishedArticle | null>(
    null
  );
  const [formData, setFormData] = useState({
    issueId: '',
    doi: '',
    pageRange: '',
    pdfUrl: '',
    keywords: '',
  });

  // Mock data for accepted manuscripts
  const acceptedManuscripts: AcceptedManuscript[] = [
    {
      id: 'MS-2024-001',
      title: 'Advanced Machine Learning Techniques in Medical Diagnosis',
      author: 'Dr. Sarah Johnson',
      acceptedDate: '2024-01-20',
      abstract:
        'This paper presents novel machine learning approaches for improving medical diagnosis accuracy...',
      status: 'ACCEPTED',
    },
    {
      id: 'MS-2024-003',
      title: 'Climate Change Impact on Coastal Ecosystems',
      author: 'Dr. Michael Chen',
      acceptedDate: '2024-01-18',
      abstract:
        'A comprehensive study on the effects of climate change on coastal marine ecosystems...',
      status: 'ACCEPTED',
    },
  ];

  // Mock data for published articles
  const [publishedArticles, setPublishedArticles] = useState<
    PublishedArticle[]
  >([
    {
      id: 'PA-001',
      articleId: 'MS-2024-002',
      issueId: 'ISS-2024-01',
      doi: '10.1234/journal.2024.001',
      status: 'PUBLISHED',
      publishedAt: '2024-01-15',
      pageRange: '1-15',
      pdfUrl: 'https://example.com/article1.pdf',
      keywords: ['AI', 'Healthcare', 'Diagnosis'],
      title: 'AI in Healthcare: Current Applications',
      author: 'Dr. Jane Smith',
    },
  ]);

  // Mock data for issues
  const issues: Issue[] = [
    {
      id: 'ISS-2024-01',
      name: 'Issue 1, 2024',
      volume: 15,
      number: 1,
      year: 2024,
    },
    {
      id: 'ISS-2024-02',
      name: 'Issue 2, 2024',
      volume: 15,
      number: 2,
      year: 2024,
    },
  ];

  const handlePublishSubmit = () => {
    if (!selectedManuscript) return;

    const newArticle: PublishedArticle = {
      id: `PA-${Date.now()}`,
      articleId: selectedManuscript.id,
      issueId: formData.issueId,
      doi: formData.doi,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      pageRange: formData.pageRange,
      pdfUrl: formData.pdfUrl,
      keywords: formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k),
      title: selectedManuscript.title,
      author: selectedManuscript.author,
    };

    setPublishedArticles((prev) => [...prev, newArticle]);
    setIsSheetOpen(false);
    resetForm();

    toast('Article Published', {
      description: `"${selectedManuscript.title}" has been successfully published.`,
    });
  };

  const handleEditSubmit = () => {
    if (!editingArticle) return;

    const updatedArticle: PublishedArticle = {
      ...editingArticle,
      issueId: formData.issueId,
      doi: formData.doi,
      pageRange: formData.pageRange,
      pdfUrl: formData.pdfUrl,
      keywords: formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k),
    };

    setPublishedArticles((prev) =>
      prev.map((article) =>
        article.id === editingArticle.id ? updatedArticle : article
      )
    );

    setIsSheetOpen(false);
    resetForm();
    setEditingArticle(null);

    toast('Article Updated', {
      description: 'Published article has been successfully updated.',
    });
  };

  const handleDelete = (articleId: string) => {
    setPublishedArticles((prev) =>
      prev.filter((article) => article.id !== articleId)
    );
    toast('Article Deleted', {
      description: 'Published article has been successfully deleted.',
    });
  };

  const openPublishSheet = (manuscript: AcceptedManuscript) => {
    setSelectedManuscript(manuscript);
    setEditingArticle(null);
    resetForm();
    setIsSheetOpen(true);
  };

  const openEditSheet = (article: PublishedArticle) => {
    setEditingArticle(article);
    setSelectedManuscript(null);
    setFormData({
      issueId: article.issueId || '',
      doi: article.doi || '',
      pageRange: article.pageRange || '',
      pdfUrl: article.pdfUrl,
      keywords: article.keywords?.join(', ') || '',
    });
    setIsSheetOpen(true);
  };

  const resetForm = () => {
    setFormData({
      issueId: '',
      doi: '',
      pageRange: '',
      pdfUrl: '',
      keywords: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Published Articles Management</h1>
      </div>

      <Tabs defaultValue="accepted" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accepted">Accepted Manuscripts</TabsTrigger>
          <TabsTrigger value="published">Published Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Accepted Manuscripts Ready for Publication
              </CardTitle>
              <CardDescription>
                These manuscripts have been accepted and are ready to be
                published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acceptedManuscripts.map((manuscript) => (
                  <div
                    key={manuscript.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{manuscript.title}</h3>
                          <Badge variant="secondary">{manuscript.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Author:</strong> {manuscript.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Accepted:</strong> {manuscript.acceptedDate}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {manuscript.abstract}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPublishSheet(manuscript)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Publish Article
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Published Articles
              </CardTitle>
              <CardDescription>Manage your published articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{article.title}</h3>
                          <Badge variant="default">{article.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Author:</strong> {article.author}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>
                            <strong>DOI:</strong>{' '}
                            {article.doi || 'Not assigned'}
                          </span>
                          <span>
                            <strong>Pages:</strong>{' '}
                            {article.pageRange || 'Not set'}
                          </span>
                          <span>
                            <strong>Published:</strong>{' '}
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {article.keywords && article.keywords.length > 0 && (
                          <div className="flex gap-1">
                            {article.keywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditSheet(article)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Publish/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {editingArticle ? 'Edit Published Article' : 'Publish Article'}
            </SheetTitle>
            <SheetDescription>
              {editingArticle
                ? 'Update the publication details for this article.'
                : `Enter the publication details for "${selectedManuscript?.title}".`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Issue</Label>
              <Select
                value={formData.issueId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, issueId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an issue" />
                </SelectTrigger>
                <SelectContent>
                  {issues.map((issue) => (
                    <SelectItem key={issue.id} value={issue.id}>
                      {issue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input
                id="doi"
                placeholder="10.1234/journal.2024.001"
                value={formData.doi}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, doi: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageRange">Page Range</Label>
              <Input
                id="pageRange"
                placeholder="1-15"
                value={formData.pageRange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pageRange: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdfUrl">PDF URL *</Label>
              <Input
                id="pdfUrl"
                placeholder="https://example.com/article.pdf"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pdfUrl: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Textarea
                id="keywords"
                placeholder="AI, Healthcare, Diagnosis (comma-separated)"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, keywords: e.target.value }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={
                  editingArticle ? handleEditSubmit : handlePublishSubmit
                }
                disabled={!formData.pdfUrl}
              >
                {editingArticle ? 'Update Article' : 'Publish Article'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PublishedArticles;
