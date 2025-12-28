'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Award,
  ArrowLeft,
  FileText,
  ClipboardList,
  UserX,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  useAddUserRole,
  useChangeUserRole,
  useDeactivateUser,
  useGetUserInfo,
  useRemoveUserRole,
} from '@/hooks/useUsers';
import { roleMap } from '@/lib/utils';
import { UserStatusDialog } from '../../editor/users/UserStatusDialog';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ChangeRoleWithPermission } from '@/components/user/ChangeUserRole';
import { DeactivateUserPermission } from '@/components/user/DeactivateUser';

const UserDetail = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const { userId } = useParams();

  const { data } = useSession();

  const { data: userInfo, isPending: isGetUserInfoPending } = useGetUserInfo(
    userId as string
  );

  // Get all roles for the user
  const userRoles = userInfo?.roles || [];
  const isAuthor = userRoles.some(
    (r: { role: string }) => r.role === 'NORMAL_USER'
  );
  const isReviewer = userRoles.some(
    (r: { role: string }) => r.role === 'REVIEWER'
  );
  const isAssociateEditor = userRoles.some(
    (r: { role: string }) => r.role === 'ASSOCIATE_EDITOR'
  );
  const isStaffEditor = userRoles.some(
    (r: { role: string }) => r.role === 'STAFF_EDITOR'
  );

  const user = {
    id: userInfo?.user.id,
    name: `${userInfo?.user.firstName} ${userInfo?.user.lastName}`.trim(),
    email: userInfo?.user.email,
    role: userInfo?.role, // Primary role for backward compatibility
    roles: userRoles, // All roles
    status: userInfo?.user.isActive ? 'Active' : 'Inactive',
    joinDate: userInfo?.user.createdAt,
    institution: userInfo?.user.affiliation || 'No institution provided',
    specialty: userInfo?.user.expertise || 'No specialty provided',
    orcid: userInfo?.user.orcid || 'No orcid provided',
    country: userInfo?.user.country || 'No country provided',
    bio: userInfo?.user.bio || 'No bio provided',
    expertise: userInfo?.user.expertise || 'No expertise provided',
    totalSubmissions: (userInfo?.user as any)?.submittedArticles?.length || 0,
    totalCorrections: (userInfo?.user as any)?.correctionsArticles?.length || 0,
    totalUnderPress: (userInfo?.user as any)?.underPressArticles?.length || 0,
    totalPublished: userInfo?.user.publishedArticles?.length || 0,
    reviewAssignments: userInfo?.user.reviewAssignments || [],
    associateEditorAssignments:
      (userInfo?.user as any)?.associateEditorAssignments || [],
    editorAssignments: (userInfo?.user as any)?.editorAssignments || [],
    submittedArticles: (userInfo?.user as any)?.submittedArticles || [],
    correctionsArticles: (userInfo?.user as any)?.correctionsArticles || [],
    underPressArticles: (userInfo?.user as any)?.underPressArticles || [],
    avatar: userInfo?.user.avatar || null,
  };

  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const { mutate, isPending: isDeactivateUserPending } = useDeactivateUser(
    user.id as string
  );
  const {
    mutate: changeUserRoleMutation,
    isPending: isChangingUserRolePending,
  } = useChangeUserRole(user.id as string);

  const { mutate: addRoleMutation, isPending: isAddingRolePending } =
    useAddUserRole(user.id as string);

  const { mutate: removeRoleMutation, isPending: isRemovingRolePending } =
    useRemoveUserRole(user.id as string);

  const handleChangeUserInfo = () => {
    const payload = {
      role: selectedRole,
    };
    changeUserRoleMutation(payload);
  };

  const handleStatusChange = () => {
    setShowStatusDialog(true);
  };

  const handleConfirmedStatusChange = () => {
    const newStatus = !userInfo?.user.isActive;
    const payload = {
      isActive: newStatus,
    };
    mutate(payload, {
      onSuccess: () => {
        setShowStatusDialog(false);
      },
    });
  };

  if (isGetUserInfoPending) {
    return <p>Loading user information...</p>;
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <UserX className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or may have been removed
              from the system.
            </p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          <div className="flex space-x-2">
            <ChangeRoleWithPermission
              handleChangeUserInfo={handleChangeUserInfo}
              handleAddRole={addRoleMutation}
              handleRemoveRole={removeRoleMutation}
              isPending={isChangingUserRolePending}
              isAddingRolePending={isAddingRolePending}
              isRemovingRolePending={isRemovingRolePending}
              requiredPermissions={['CHANGE_ROLE']}
              role={
                data?.user.role as
                  | 'NORMAL_USER'
                  | 'CHIEF_EDITOR'
                  | 'REVIEWER'
                  | 'STAFF_EDITOR'
              }
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              userName={user.name}
              userRole={user.role as string}
              userRoles={user.roles || []}
              fallback={<></>}
            />
            <DeactivateUserPermission
              handleStatusChange={handleStatusChange}
              isActive={userInfo?.user.isActive ?? true}
              isPending={isDeactivateUserPending}
              requiredPermissions={['DEACTIVATE_USER']}
              role={
                data?.user.role as
                  | 'NORMAL_USER'
                  | 'CHIEF_EDITOR'
                  | 'STAFF_EDITOR'
                  | 'REVIEWER'
              }
              fallback={<></>}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map(
                          (userRole: { id: string; role: string }) => (
                            <Badge key={userRole.id} variant={'secondary'}>
                              {roleMap[userRole.role]}
                            </Badge>
                          )
                        )
                      ) : (
                        <Badge variant={'secondary'}>
                          {roleMap[userInfo?.role as string] || 'No role'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Joined: {user.joinDate}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Institution:</span>
                    <span className="text-sm">{user.institution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 mr-3">
                      Specialty:
                    </span>
                    <span className="text-sm text-right">{user.specialty}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">ORCID: {user.orcid}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Country: {user.country}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Bio:</span>
                  </div>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Expertise:</span>
                  </div>
                  <p className="text-sm text-gray-600">{user.expertise}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Author Statistics */}
                {isAuthor && (
                  <>
                    {/* Total Submissions (SUBMITTED status) */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Submissions ({user.totalSubmissions ?? 0})
                      </span>
                      {user.submittedArticles &&
                        user.submittedArticles.length > 0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Submissions</SheetTitle>
                                <SheetDescription>
                                  All {user.name}'s submitted manuscripts
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {user.submittedArticles.map(
                                      (article: {
                                        id: string;
                                        createdAt: string;
                                        articleStatus: string;
                                        metadata: { title: string } | null;
                                      }) => (
                                        <Card className="p-3" key={article.id}>
                                          <div>
                                            <Link
                                              href={`/articles/${article.id}`}
                                              target="_blank"
                                            >
                                              <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                                {article.metadata?.title ||
                                                  'Untitled'}
                                              </h5>
                                            </Link>
                                            <div className="mt-2 flex items-center gap-4">
                                              <span className="text-xs text-gray-500">
                                                Submitted:{' '}
                                                {format(
                                                  new Date(article.createdAt),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {article.articleStatus}
                                              </Badge>
                                            </div>
                                          </div>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>

                    {/* Total Corrections (UNDER REVIEW and CORRECTION status) */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Corrections ({user.totalCorrections ?? 0})
                      </span>
                      {user.correctionsArticles &&
                        user.correctionsArticles.length > 0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Corrections</SheetTitle>
                                <SheetDescription>
                                  All {user.name}'s articles under review or
                                  requiring corrections
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {user.correctionsArticles.map(
                                      (article: {
                                        id: string;
                                        createdAt: string;
                                        articleStatus: string;
                                        metadata: { title: string } | null;
                                      }) => (
                                        <Card className="p-3" key={article.id}>
                                          <div>
                                            <Link
                                              href={`/articles/${article.id}`}
                                              target="_blank"
                                            >
                                              <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                                {article.metadata?.title ||
                                                  'Untitled'}
                                              </h5>
                                            </Link>
                                            <div className="mt-2 flex items-center gap-4">
                                              <span className="text-xs text-gray-500">
                                                Submitted:{' '}
                                                {format(
                                                  new Date(article.createdAt),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {article.articleStatus}
                                              </Badge>
                                            </div>
                                          </div>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>

                    {/* Total Under Press (UNDER PRESS status) */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Under Press ({user.totalUnderPress ?? 0})
                      </span>
                      {user.underPressArticles &&
                        user.underPressArticles.length > 0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Under Press</SheetTitle>
                                <SheetDescription>
                                  All {user.name}'s articles currently under
                                  press
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {user.underPressArticles.map(
                                      (article: {
                                        id: string;
                                        createdAt: string;
                                        articleStatus: string;
                                        metadata: { title: string } | null;
                                      }) => (
                                        <Card className="p-3" key={article.id}>
                                          <div>
                                            <Link
                                              href={`/articles/${article.id}`}
                                              target="_blank"
                                            >
                                              <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                                {article.metadata?.title ||
                                                  'Untitled'}
                                              </h5>
                                            </Link>
                                            <div className="mt-2 flex items-center gap-4">
                                              <span className="text-xs text-gray-500">
                                                Submitted:{' '}
                                                {format(
                                                  new Date(article.createdAt),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {article.articleStatus}
                                              </Badge>
                                            </div>
                                          </div>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Published Articles ({user.totalPublished ?? 0})
                      </span>
                      {Array.isArray(userInfo?.user.publishedArticles) &&
                        userInfo?.user.publishedArticles.length > 0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Published Articles</SheetTitle>
                                <SheetDescription>
                                  All {user.name}'s published articles
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {userInfo?.user.publishedArticles.map(
                                      (a) => (
                                        <Card className="p-3" key={a.id}>
                                          <div>
                                            <Link
                                              href={`/articles/article/${a.slug}`}
                                              target="_blank"
                                            >
                                              <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                                {a.article.metadata?.title ||
                                                  'Untitled'}
                                              </h5>
                                            </Link>
                                            <div className="mt-2">
                                              <span className="text-xs text-gray-500">
                                                Published:{' '}
                                                {format(
                                                  new Date(a.publishedAt),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>
                  </>
                )}

                {/* Reviewer Statistics */}
                {isReviewer && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Review Assignments ({user.reviewAssignments?.length ?? 0})
                    </span>
                    {Array.isArray(user.reviewAssignments) &&
                      user.reviewAssignments.length > 0 && (
                        <Sheet>
                          <SheetTrigger>
                            <Button variant="outline" size="sm">
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Review Assignments</SheetTitle>
                              <SheetDescription>
                                All review assignments for {user.name}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 mt-6">
                              <ScrollArea className="h-[550px] pr-4">
                                <div className="space-y-3">
                                  {user.reviewAssignments.map((assignment) => (
                                    <Card className="p-3" key={assignment.id}>
                                      <div>
                                        <Link
                                          href={`/articles/${assignment.article?.id}`}
                                          target="_blank"
                                        >
                                          <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                            {assignment.article?.metadata
                                              ?.title || 'Untitled'}
                                          </h5>
                                        </Link>
                                        <div className="mt-2 flex items-center gap-4 flex-wrap">
                                          <span className="text-xs text-gray-500">
                                            Assigned:{' '}
                                            {assignment.assignedDate
                                              ? format(
                                                  new Date(
                                                    assignment.assignedDate
                                                  ),
                                                  'MMM dd, yyyy'
                                                )
                                              : 'N/A'}
                                          </span>
                                          {assignment.dueDate && (
                                            <span className="text-xs text-gray-500">
                                              Due:{' '}
                                              {format(
                                                new Date(assignment.dueDate),
                                                'MMM dd, yyyy'
                                              )}
                                            </span>
                                          )}
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {assignment.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                  </div>
                )}

                {/* Associate Editor Statistics */}
                {isAssociateEditor && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Associate Editor Assignments (
                      {user.associateEditorAssignments?.length ?? 0})
                    </span>
                    {Array.isArray(user.associateEditorAssignments) &&
                      user.associateEditorAssignments.length > 0 && (
                        <Sheet>
                          <SheetTrigger>
                            <Button variant="outline" size="sm">
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>
                                Associate Editor Assignments
                              </SheetTitle>
                              <SheetDescription>
                                All associate editor assignments for {user.name}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 mt-6">
                              <ScrollArea className="h-[550px] pr-4">
                                <div className="space-y-3">
                                  {user.associateEditorAssignments.map(
                                    (assignment: any) => (
                                      <Card className="p-3" key={assignment.id}>
                                        <div>
                                          <Link
                                            href={`/articles/${assignment.articleSubmissions?.id}`}
                                            target="_blank"
                                          >
                                            <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                              {assignment.articleSubmissions
                                                ?.metadata?.title || 'Untitled'}
                                            </h5>
                                          </Link>
                                          <div className="mt-2 flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-gray-500">
                                              Assigned:{' '}
                                              {assignment.assignedAt
                                                ? format(
                                                    new Date(
                                                      assignment.assignedAt
                                                    ),
                                                    'MMM dd, yyyy'
                                                  )
                                                : 'N/A'}
                                            </span>
                                            {assignment.dueDate && (
                                              <span className="text-xs text-gray-500">
                                                Due:{' '}
                                                {format(
                                                  new Date(assignment.dueDate),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                            )}
                                            {assignment.finalizedAt && (
                                              <span className="text-xs text-gray-500">
                                                Finalized:{' '}
                                                {format(
                                                  new Date(
                                                    assignment.finalizedAt
                                                  ),
                                                  'MMM dd, yyyy'
                                                )}
                                              </span>
                                            )}
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {assignment.status}
                                            </Badge>
                                          </div>
                                          {assignment.staffEditor && (
                                            <div className="mt-2">
                                              <span className="text-xs text-gray-500">
                                                Assigned by:{' '}
                                                {
                                                  assignment.staffEditor
                                                    .firstName
                                                }{' '}
                                                {
                                                  assignment.staffEditor
                                                    .lastName
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Card>
                                    )
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                  </div>
                )}

                {/* Staff Editor Statistics */}
                {isStaffEditor && (
                  <>
                    {/* Submitted Editor Assignments */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Submitted Assignments (
                        {(user.editorAssignments as any)?.submitted?.length ??
                          0}
                        )
                      </span>
                      {(user.editorAssignments as any)?.submitted &&
                        (user.editorAssignments as any).submitted.length >
                          0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Submitted Assignments</SheetTitle>
                                <SheetDescription>
                                  All submitted editor assignments for{' '}
                                  {user.name}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {(
                                      user.editorAssignments as any
                                    ).submitted.map((assignment: any) => (
                                      <Card className="p-3" key={assignment.id}>
                                        <div>
                                          <Link
                                            href={`/articles/${assignment.articleSubmission?.id}`}
                                            target="_blank"
                                          >
                                            <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                              {assignment.articleSubmission
                                                ?.metadata?.title || 'Untitled'}
                                            </h5>
                                          </Link>
                                          <div className="mt-2 flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-gray-500">
                                              Assigned:{' '}
                                              {assignment.assignedAt
                                                ? format(
                                                    new Date(
                                                      assignment.assignedAt
                                                    ),
                                                    'MMM dd, yyyy'
                                                  )
                                                : 'N/A'}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {
                                                assignment.articleSubmission
                                                  ?.articleStatus
                                              }
                                            </Badge>
                                          </div>
                                          {assignment.articleSubmission
                                            ?.user && (
                                            <div className="mt-2">
                                              <span className="text-xs text-gray-500">
                                                Author:{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.firstName
                                                }{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.lastName
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>

                    {/* Corrections Editor Assignments */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Corrections Assignments (
                        {(user.editorAssignments as any)?.corrections?.length ??
                          0}
                        )
                      </span>
                      {(user.editorAssignments as any)?.corrections &&
                        (user.editorAssignments as any).corrections.length >
                          0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Corrections Assignments</SheetTitle>
                                <SheetDescription>
                                  All corrections editor assignments for{' '}
                                  {user.name}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {(
                                      user.editorAssignments as any
                                    ).corrections.map((assignment: any) => (
                                      <Card className="p-3" key={assignment.id}>
                                        <div>
                                          <Link
                                            href={`/articles/${assignment.articleSubmission?.id}`}
                                            target="_blank"
                                          >
                                            <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                              {assignment.articleSubmission
                                                ?.metadata?.title || 'Untitled'}
                                            </h5>
                                          </Link>
                                          <div className="mt-2 flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-gray-500">
                                              Assigned:{' '}
                                              {assignment.assignedAt
                                                ? format(
                                                    new Date(
                                                      assignment.assignedAt
                                                    ),
                                                    'MMM dd, yyyy'
                                                  )
                                                : 'N/A'}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {
                                                assignment.articleSubmission
                                                  ?.articleStatus
                                              }
                                            </Badge>
                                          </div>
                                          {assignment.articleSubmission
                                            ?.user && (
                                            <div className="mt-2">
                                              <span className="text-xs text-gray-500">
                                                Author:{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.firstName
                                                }{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.lastName
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>

                    {/* Under Press Editor Assignments */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Under Press Assignments (
                        {(user.editorAssignments as any)?.underPress?.length ??
                          0}
                        )
                      </span>
                      {(user.editorAssignments as any)?.underPress &&
                        (user.editorAssignments as any).underPress.length >
                          0 && (
                          <Sheet>
                            <SheetTrigger>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Under Press Assignments</SheetTitle>
                                <SheetDescription>
                                  All under press editor assignments for{' '}
                                  {user.name}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="space-y-4 mt-6">
                                <ScrollArea className="h-[550px] pr-4">
                                  <div className="space-y-3">
                                    {(
                                      user.editorAssignments as any
                                    ).underPress.map((assignment: any) => (
                                      <Card className="p-3" key={assignment.id}>
                                        <div>
                                          <Link
                                            href={`/articles/${assignment.articleSubmission?.id}`}
                                            target="_blank"
                                          >
                                            <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                              {assignment.articleSubmission
                                                ?.metadata?.title || 'Untitled'}
                                            </h5>
                                          </Link>
                                          <div className="mt-2 flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-gray-500">
                                              Assigned:{' '}
                                              {assignment.assignedAt
                                                ? format(
                                                    new Date(
                                                      assignment.assignedAt
                                                    ),
                                                    'MMM dd, yyyy'
                                                  )
                                                : 'N/A'}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {
                                                assignment.articleSubmission
                                                  ?.articleStatus
                                              }
                                            </Badge>
                                          </div>
                                          {assignment.articleSubmission
                                            ?.user && (
                                            <div className="mt-2">
                                              <span className="text-xs text-gray-500">
                                                Author:{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.firstName
                                                }{' '}
                                                {
                                                  assignment.articleSubmission
                                                    .user.lastName
                                                }
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )}
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!isAuthor &&
                  !isReviewer &&
                  !isAssociateEditor &&
                  !isStaffEditor && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">
                        No role-based statistics available
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showStatusDialog && (
        <UserStatusDialog
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          username={user.name}
          currentStatus={userInfo?.user.isActive}
          onConfirm={handleConfirmedStatusChange}
          isPending={isDeactivateUserPending}
        />
      )}
    </>
  );
};

export default UserDetail;
