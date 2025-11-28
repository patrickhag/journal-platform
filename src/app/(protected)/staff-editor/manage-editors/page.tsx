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
import { Mail, Building, FileText, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnAssignEditorAlertDialog } from './components/UnAssignEditorAlertDialog';
import { useGetAssignedAssociateEditors } from '../hooks/useAssociateEditorHooks';
import { format } from 'date-fns';

const ManageEditors = () => {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [articleId, setArticleId] = useState('');
  const [userId, setUserId] = useState('');

  const { data: associateEditorsInfo = [], isPending } =
    useGetAssignedAssociateEditors();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Editors</h1>
          </div>
        </div>

        {/* Reviewers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Associate Editors{' '}
              {`(${associateEditorsInfo ? associateEditorsInfo?.length : 'N/A'})`}
            </CardTitle>
            <CardDescription>
              Manage associate editor accounts and track their assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Editor</TableHead>
                  <TableHead>Affiliation</TableHead>
                  <TableHead>Expertise</TableHead>
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
                {associateEditorsInfo?.map((editor) => {
                  const name = `${editor.user.prefix ?? ''} ${editor.user.firstName} ${editor.user.lastName}`;
                  const assignments = editor.user.associateEditorAssignments;
                  return (
                    <TableRow key={editor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {editor.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Building className="mr-2 h-4 w-4 text-gray-400" />
                          {editor.user.affiliation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {editor.user.expertise
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
                          {editor.user.expertise &&
                            editor.user.expertise.split(',').length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{editor.user.expertise.split(',').length - 2}
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignments && assignments.length > 0 ? (
                          <div className="space-y-1 max-w-xs">
                            {assignments.map((submission) => (
                              <div className="text-xs" key={submission.id}>
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex-1">
                                    {
                                      submission.articleSubmissions.metadata
                                        .title
                                    }
                                  </div>
                                </div>
                                <div>
                                  <Badge className="bg-yellow-50 text-yellow-600 text-xs">
                                    {
                                      submission.articleSubmissions
                                        .articleStatus
                                    }
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No assignments
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
                                  editor
                                </SheetDescription>
                              </SheetHeader>

                              <div className="space-y-4 mt-6">
                                {assignments && assignments.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      Current Assignment
                                      {assignments.length > 1 ? 's' : ''}
                                    </h4>
                                    <ScrollArea className="h-[550px] pr-4">
                                      <div className="space-y-3">
                                        {assignments.map((submission) => (
                                          <Card
                                            key={submission.id}
                                            className="p-4"
                                          >
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="flex-1">
                                                <Link
                                                  href={`/articles/${submission.id}`}
                                                  target="_blank"
                                                  className="hover:underline"
                                                >
                                                  <h5 className="font-medium text-sm line-clamp-1">
                                                    {
                                                      submission
                                                        .articleSubmissions
                                                        .metadata.title
                                                    }
                                                  </h5>
                                                </Link>
                                                <div className="flex items-center mt-2 gap-2">
                                                  <span className="text-xs text-gray-500">
                                                    Due:{' '}
                                                    {format(
                                                      new Date(
                                                        submission.dueDate as Date
                                                      ),
                                                      'M-dd-yyyy'
                                                    )}
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    •
                                                  </span>
                                                  <div className="text-xs text-gray-500">
                                                    Assigned:{' '}
                                                    {format(
                                                      new Date(
                                                        submission.assignedAt as Date
                                                      ),
                                                      'M-dd-yyyy'
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-100"
                                                onClick={() => {
                                                  setOpenAlertDialog(true);
                                                  setUserId(editor.user.id);
                                                  setArticleId(
                                                    submission.articleId
                                                  );
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                              </Button>
                                            </div>
                                          </Card>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                )}
                                {assignments && assignments.length === 0 && (
                                  <div className="text-sm text-gray-500">
                                    This editor has no current assignments.
                                  </div>
                                )}
                              </div>
                            </SheetContent>
                          </Sheet>
                          <Link href={`/users/${editor.user.id}`}>
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {!isPending && associateEditorsInfo?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-4">No associate editors found.</div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </CardContent>
        </Card>
      </div>
      {openAlertDialog && (
        <UnAssignEditorAlertDialog
          articleId={articleId}
          isOpen={openAlertDialog}
          setOpenAlertDialog={setOpenAlertDialog}
          userId={userId}
        />
      )}
    </>
  );
};

export default ManageEditors;
