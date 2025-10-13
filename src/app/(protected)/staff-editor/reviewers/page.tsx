'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Mail,
  Building,
  FileText,
  Trash2,
  Bell,
  UserPlus,
  FilePlus,
} from 'lucide-react';
import { useGetReviewersInfo } from '@/hooks/useReviews';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnAssignAlertDialog } from '../components/UnAssignReviewerDialog';
import { RemindReviewersDialog } from '../components/RemindReviewersDialog';
import AddReviewerSheetModal from '@/components/staff-editor/AddReviewerSheetModal';

const ManageReviewers = () => {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [articleId, setArticleId] = useState('');
  const [userId, setUserId] = useState('');
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openAddReviewerModal, setOpenAddReviewerModal] = useState(false);
  const { data: reviewersInfo = [], isPending } = useGetReviewersInfo();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manage Reviewers</h1>
          <Button
            variant="outline"
            size="lg"
            className="mb-2"
            onClick={() => setOpenAddReviewerModal(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Reviewer
          </Button>
        </div>

        {/* Reviewers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Reviewers {`(${reviewersInfo ? reviewersInfo?.length : 'N/A'})`}
            </CardTitle>

            <CardDescription>
              Manage reviewer accounts and track their assignments
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Affiliation</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Current Assignments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="py-4">Loading...</div>
                    </TableCell>
                  </TableRow>
                )}
                {reviewersInfo?.map((reviewer) => {
                  const name = `${reviewer.user.prefix ?? ''} ${reviewer.user.firstName} ${reviewer.user.lastName}`;
                  const underReviewAssignments =
                    reviewer.user.reviewAssignments.filter(
                      (review) =>
                        review.article.articleStatus === 'UNDER REVIEW'
                    );
                  const reviews = reviewer.user.reviews;
                  return (
                    <TableRow key={reviewer.id}>
                      <TableCell>
                        <div>
                          <Link
                            className="font-medium hover:underline"
                            href={`/users/${reviewer.user.id}`}
                          >
                            {name}
                          </Link>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {reviewer.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Building className="mr-2 h-4 w-4 text-gray-400" />
                          {reviewer.user.affiliation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {reviewer.user.expertise
                            ?.split(',')
                            .slice(0, 2)
                            .map((exp, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {exp.trim()}
                              </Badge>
                            ))}
                          {reviewer.user.expertise &&
                            reviewer.user.expertise.split(',').length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{reviewer.user.expertise.split(',').length - 2}
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center font-semibold">
                          {reviews.length}
                        </div>
                      </TableCell>
                      <TableCell>
                        {underReviewAssignments &&
                        underReviewAssignments.length > 0 ? (
                          <div className="space-y-1 max-w-xs">
                            {underReviewAssignments
                              .slice(0, 2)
                              .map((assignment) => (
                                <div key={assignment.id} className="text-xs">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium truncate flex-1">
                                      {assignment.article.metadata.title}
                                    </div>
                                  </div>
                                  <div>
                                    <Badge className="bg-yellow-50 text-yellow-600 text-xs">
                                      {assignment.article.articleStatus}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            {underReviewAssignments.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{underReviewAssignments.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No assignments
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-none w-[450px]">
                            <SheetHeader>
                              <SheetTitle>
                                Manage Assignments - {name}
                              </SheetTitle>
                              <SheetDescription>
                                View and remove current assignments for this
                                reviewer
                              </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-4 mt-6">
                              {underReviewAssignments.length > 0 ? (
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Current Assignments
                                  </h4>
                                  <ScrollArea className="h-[5500px] pr-4">
                                    <div className="space-y-3">
                                      {underReviewAssignments.map(
                                        (assignment) => (
                                          <Card
                                            key={assignment.id}
                                            className="p-4"
                                          >
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="flex-1">
                                                <Link
                                                  href={`/articles/${assignment.article.id}`}
                                                  target="_blank"
                                                  className="hover:underline"
                                                >
                                                  <h5 className="font-medium text-sm line-clamp-1">
                                                    {
                                                      assignment.article
                                                        .metadata.title
                                                    }
                                                  </h5>
                                                </Link>
                                                <div className="flex items-center mt-2 gap-2">
                                                  <span className="text-xs text-gray-500">
                                                    Due:{' '}
                                                    {
                                                      assignment.dueDate as unknown as string
                                                    }
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    •
                                                  </span>
                                                  <div className="text-xs text-gray-500">
                                                    Assigned:{' '}
                                                    {
                                                      assignment.assignedDate as unknown as string
                                                    }
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0 hover:bg-red-100"
                                                  onClick={() => {
                                                    setOpenAlertDialog(true);
                                                    setUserId(
                                                      reviewer.userId as string
                                                    );
                                                    setArticleId(
                                                      assignment.articleId
                                                    );
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0 hover:bg-blue-100"
                                                  onClick={() => {
                                                    setOpenNotificationDialog(
                                                      true
                                                    );
                                                    setUserId(
                                                      reviewer.userId as string
                                                    );
                                                    setArticleId(
                                                      assignment.articleId
                                                    );
                                                  }}
                                                >
                                                  <Bell className="h-4 w-4 text-blue-500" />
                                                </Button>
                                              </div>
                                            </div>
                                          </Card>
                                        )
                                      )}
                                    </div>
                                  </ScrollArea>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                                    No assignments
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This reviewer has no current assignments.
                                  </p>
                                </div>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {!isPending && reviewersInfo?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-4">No reviewers found.</div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </CardContent>
        </Card>
      </div>
      {openAlertDialog && (
        <UnAssignAlertDialog
          articleId={articleId}
          isOpen={openAlertDialog}
          setOpenAlertDialog={setOpenAlertDialog}
          userId={userId}
        />
      )}
      {openNotificationDialog && (
        <RemindReviewersDialog
          articleId={articleId}
          isOpen={openNotificationDialog}
          setOpenAlertDialog={setOpenNotificationDialog}
          userId={userId}
        />
      )}
      <AddReviewerSheetModal
        open={openAddReviewerModal}
        onOpenChange={setOpenAddReviewerModal}
      />
    </>
  );
};

export default ManageReviewers;
