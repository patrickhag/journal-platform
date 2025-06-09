'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ChevronLeft,
  FileText,
  Users,
  MessageSquare,
  Download,
  FileIcon,
  File as FilePdf,
  FileImage,
  FileCheck,
  Clock,
  Send,
} from 'lucide-react';
import Link from 'next/link';
interface Review {
  id: string;
  reviewer: {
    name: string;
    institution: string;
  };
  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'minor_revision'
    | 'major_revision';
  feedback: string;
  date: string;
}

interface File {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'pending' | 'reviewed' | 'approved';
}

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      reviewer: {
        name: 'Dr. Michael Smith',
        institution: 'Johns Hopkins University',
      },
      status: 'minor_revision',
      feedback:
        'The manuscript shows promise but requires minor revisions in the methodology section. Please clarify the statistical analysis approach.',
      date: '2024-03-20',
    },
    {
      id: '2',
      reviewer: {
        name: 'Dr. Sarah Johnson',
        institution: 'Stanford University',
      },
      status: 'pending',
      feedback: 'Currently reviewing the methodology section...',
      date: '2024-03-21',
    },
    {
      id: '3',
      reviewer: {
        name: 'Dr. James Wilson',
        institution: 'Harvard Medical School',
      },
      status: 'accepted',
      feedback:
        'Excellent research with strong implications for public health.',
      date: '2024-03-22',
    },
  ]);

  const [files] = useState<File[]>([
    {
      id: '1',
      name: 'manuscript_final_v2.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-03-19',
      status: 'pending',
    },
    {
      id: '2',
      name: 'data_analysis_results.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedBy: 'Dr. Michael Smith',
      uploadDate: '2024-03-20',
      status: 'reviewed',
    },
    {
      id: '3',
      name: 'supplementary_figures.png',
      type: 'image',
      size: '4.2 MB',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-03-21',
      status: 'approved',
    },
    {
      id: '4',
      name: 'reviewer_comments.docx',
      type: 'document',
      size: '567 KB',
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: '2024-03-22',
      status: 'reviewed',
    },
  ]);

  const [resubmissionMessage, setResubmissionMessage] = useState('');

  const getFileIcon = (type: File['type']) => {
    switch (type) {
      case 'pdf':
        return <FilePdf className="h-4 w-4 text-red-500" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-blue-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: File['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500">
            <FileCheck className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'reviewed':
        return (
          <Badge variant="secondary">
            <FileCheck className="h-3 w-3 mr-1" /> Reviewed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/20 text-yellow-700"
          >
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  const getReviewStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge variant="default" className="bg-green-500">
            Accepted
          </Badge>
        );
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'minor_revision':
        return (
          <Badge variant="default" className="bg-blue-500">
            Minor Revision
          </Badge>
        );
      case 'major_revision':
        return (
          <Badge variant="default" className="bg-orange-500">
            Major Revision
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleSendResubmissionRequest = () => {
    if (!resubmissionMessage.trim()) {
      toast.error('Please enter a message for the author');
      return;
    }

    toast.success('Resubmission request sent to the author');
    setResubmissionMessage('');
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Request Resubmission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Resubmission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Message to Author</label>
                <Textarea
                  value={resubmissionMessage}
                  onChange={(e) => setResubmissionMessage(e.target.value)}
                  placeholder="Enter your message to the author..."
                  className="mt-1.5"
                  rows={6}
                />
              </div>
              <Button
                onClick={handleSendResubmissionRequest}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left sidebar with article info */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Title</h3>
                <p className="text-sm text-muted-foreground">
                  Strategies for Enhancing Resilience
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge>Under Review</Badge>
              </div>
              <div>
                <h3 className="font-medium">Reviewers</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {reviews.length} Assigned Reviewers
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="md:col-span-8">
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reviews">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="files">
                <FileText className="h-4 w-4 mr-2" />
                Files ({files.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-6">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {review.reviewer.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {review.reviewer.institution}
                                </p>
                              </div>
                              {getReviewStatusBadge(review.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{review.feedback}</p>
                            <div className="mt-4 text-sm text-muted-foreground">
                              Submitted on {review.date}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardContent className="p-6">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {getFileIcon(file.type)}
                            <div>
                              <h4 className="font-medium">{file.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Uploaded by {file.uploadedBy} on{' '}
                                {file.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(file.status)}
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
