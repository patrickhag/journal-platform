'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
  Edit,
  UserCog,
  FileText,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  useChangeUserRole,
  useDeactivateUser,
  useGetUserInfo,
} from '@/hooks/useUsers';
import { roleMap } from '@/lib/utils';
import Loader from '@/components/Loader';
import { UserStatusDialog } from '../../editor/users/UserStatusDialog';
import withPermissions from '@/components/WithPermission';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const UserDetail = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const { userId } = useParams();

  const { data } = useSession();

  const { data: userInfo, isPending: isGetUserInfoPending } = useGetUserInfo(
    userId as string
  );

  const user = {
    id: userInfo?.user.id,
    name: `${userInfo?.user.firstName} ${userInfo?.user.lastName}`.trim(),
    email: userInfo?.user.email,
    role: userInfo?.role,
    status: userInfo?.user.isActive ? 'Active' : 'Inactive',
    joinDate: userInfo?.user.createdAt,
    institution: userInfo?.user.affiliation || 'No institution provided',
    specialty: userInfo?.user.expertise || 'No specialty provided',
    orcid: userInfo?.user.orcid || 'No orcid provided',
    country: userInfo?.user.country || 'No country provided',
    bio: userInfo?.user.bio || 'No bio provided',
    expertise: userInfo?.user.expertise || 'No expertise provided',
    totalSubmissions: userInfo?.user.articles?.length || 0,
    totalPublished: userInfo?.user.publishedArticles?.length || 0,
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
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
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
              isPending={isChangingUserRolePending}
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
                    <Badge variant={'secondary'}>
                      {roleMap[userInfo?.role as string]}
                    </Badge>
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
                    <span className="text-sm text-gray-600">Specialty:</span>
                    <span className="text-sm">{user.specialty}</span>
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Submissions ({user.totalSubmissions ?? 'N/A'})
                  </span>
                  {Array.isArray(userInfo?.user.articles) &&
                    userInfo?.user.articles.length > 0 && (
                      <Sheet>
                        <SheetTrigger>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Manuscripts</SheetTitle>
                            <SheetDescription>
                              All {user.name}'s submitted manuscripts
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 mt-6">
                            <ScrollArea className="h-[5500px] pr-4">
                              <div className="space-y-3">
                                {userInfo?.user.articles.map((article) => (
                                  <Card className="p-3" key={article.id}>
                                    <div>
                                      <Link
                                        href={`/articles/${article.id}`}
                                        target="_blank"
                                      >
                                        <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                          {article.metadata.title}
                                        </h5>
                                      </Link>
                                      <div className="mt-2">
                                        <span className="text-xs text-gray-500">
                                          Submitted:{' '}
                                          {format(
                                            new Date(article.createdAt),
                                            'MMM dd, yyyy'
                                          )}
                                        </span>
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Published Articles ({user.totalPublished ?? 'N/A'})
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
                            <SheetTitle>Articles</SheetTitle>
                            <SheetDescription>
                              All {user.name}'s published articles
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 mt-6">
                            <ScrollArea className="h-[5500px] pr-4">
                              <div className="space-y-3">
                                {userInfo?.user.publishedArticles.map((a) => (
                                  <Card className="p-3" key={a.id}>
                                    <div>
                                      <Link
                                        href={`/articles/article/${a.slug}`}
                                        target="_blank"
                                      >
                                        <h5 className="font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
                                          {a.article.metadata.title}
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
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                </div>
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

const ChangeRole = ({
  handleChangeUserInfo,
  selectedRole,
  setSelectedRole,
  isPending,
  userName,
  userRole,
}: {
  handleChangeUserInfo: () => void;
  selectedRole: string;
  setSelectedRole: Dispatch<SetStateAction<string>>;
  isPending: boolean;
  userName: string;
  userRole: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Change Role
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User Role</SheetTitle>
          <SheetDescription>Change the role for {userName}</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Role</label>
              <p className="text-sm text-muted-foreground">
                {roleMap[userRole]}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">New Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL_USER">Author</SelectItem>
                  <SelectItem value="REVIEWER">Reviewer</SelectItem>
                  <SelectItem value="ASSOCIATE_EDITOR">
                    Associate Editor
                  </SelectItem>
                  <SelectItem value="CHIEF_EDITOR">Staff Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              onClick={handleChangeUserInfo}
              disabled={!selectedRole || isPending}
            >
              {isPending ? <Loader text="Changing..." /> : 'Save Changes'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const ChangeRoleWithPermission = withPermissions(ChangeRole);

const DeactivateUser = ({
  handleStatusChange,
  isPending,
  isActive,
}: {
  handleStatusChange: () => void;
  isPending: boolean;
  isActive: boolean;
}) => {
  return (
    <Button
      onClick={handleStatusChange}
      disabled={isPending}
      className={`${
        isActive
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <UserCog className="mr-2 h-5 w-5" />
      {isPending ? (
        <Loader text={isActive ? 'Deactivating...' : 'Activating...'} />
      ) : (
        `${isActive ? 'Deactivate' : 'Activate'} User`
      )}
    </Button>
  );
};

const DeactivateUserPermission = withPermissions(DeactivateUser);
