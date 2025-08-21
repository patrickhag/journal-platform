'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Filter, Eye } from 'lucide-react';
import { useGetContacts, useGetFeedbacks } from '@/hooks/useContacts';
import { useState } from 'react';
import ViewInquiryModal from './component/ViewInquiryModal';

const ManageInquiries = () => {
  const { data: contacts, isPending } = useGetContacts();
  const { data: feedbacks, isPending: isFeedbacksDataPending } =
    useGetFeedbacks();

  const [modalType, setModalType] = useState<'contact' | 'feedback' | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRatingStars = (rating: string) => {
    if (!rating) return 'N/A';
    const stars = '⭐'.repeat(parseInt(rating));
    return `${stars} (${rating}/5)`;
  };

  const handleViewClick = (item: any, type: 'contact' | 'feedback') => {
    setSelectedData(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Manage Inquiries & Feedback
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all contact inquiries and feedback submissions from
          users.
        </p>
      </div>
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                All Inquiries related to messages ({contacts?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Names</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(contacts?.length ?? 0) <= 0 && isPending && (
                      <div className="py-4">
                        <p>Loading...</p>
                      </div>
                    )}
                    {(contacts?.length ?? 0) === 0 && (
                      <div className="py-4">
                        <p>No sent messages contacts available.</p>
                      </div>
                    )}
                    {contacts?.map((item) => (
                      <TableRow key={`${item.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {`${item.firstName} ${item.lastName}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.email}
                            </p>
                            {item.institution && (
                              <p className="text-xs text-muted-foreground">
                                {item.institution}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium">{item.subject}</p>
                            <p className="text-sm text-muted-foreground truncate line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(item.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClick(item, 'contact')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                All Inquiries related to feedbacks ({feedbacks?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Names</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks?.map((item) => (
                      <TableRow key={`${item.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.name || `No name provided`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.email}
                            </p>
                            {item.email && (
                              <p className="text-xs text-muted-foreground">
                                {item.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium">{item.feedbackType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium">
                              {item.rating
                                ? getRatingStars(item.rating || '')
                                : 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium">
                              {item.feedbackMessage}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(item.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClick(item, 'feedback')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Modal */}
      {modalType && (
        <ViewInquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          data={selectedData}
        />
      )}
    </div>
  );
};

export default ManageInquiries;
