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
import { Calendar, Filter, Eye, Users, Send, Mail } from 'lucide-react';
import {
  useGetContacts,
  useGetFeedbacks,
  useGetSubscribers,
  useSendEmails,
} from '@/hooks/useContacts';
import { useState } from 'react';
import ViewInquiryModal from './component/ViewInquiryModal';
import { format } from 'date-fns';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Loader';

const ManageInquiries = () => {
  const { data: contacts, isPending } = useGetContacts();
  const { data: feedbacks } = useGetFeedbacks();
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [subject, setSubject] = useState('');
  const { data: subscribers } = useGetSubscribers();

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

  const { mutate, isPending: isSendingEmail } = useSendEmails();

  const handleViewClick = (item: any, type: 'contact' | 'feedback') => {
    setSelectedData(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSendNewsletter = () => {
    const data = {
      subject,
      message: newsletterMessage,
    };
    mutate(data);
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
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
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
        {/* Newsletter Tab */}
        <TabsContent value="newsletter">
          <div className="space-y-6">
            {/* Email Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="newsletter-message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message to send to all subscribers ({subscribers?.length}{' '}
                    recipients)
                  </label>
                  <Input
                    id="newsletter-message"
                    type="text"
                    placeholder="Enter email subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="my-3"
                  />
                  <RichTextEditor
                    placeholder="Write your newsletter message here..."
                    description={newsletterMessage}
                    onChange={(e) => setNewsletterMessage(e)}
                  />
                </div>
                <Button
                  disabled={!newsletterMessage.trim() || isSendingEmail}
                  className="w-full"
                  onClick={handleSendNewsletter}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingEmail ? (
                    <Loader text="Sending..." />
                  ) : (
                    'Send Newsletter to All Subscribers'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter Subscribers Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Newsletter Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers?.map((subscriber, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {subscriber.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {format(
                                new Date(subscriber.subscribedAt),
                                'MMM dd, yyyy'
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
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
