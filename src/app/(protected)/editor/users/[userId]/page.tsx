'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDeactivateUser, useGetUserInfo } from '@/hooks/useUsers';
import { roleMap } from '@/lib/utils';
import Loader from '@/components/Loader';
import { UserStatusDialog } from '../UserStatusDialog';

const UserDetail = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const { userId } = useParams();

  const { data: userInfo } = useGetUserInfo(userId as string);

  const user = {
    id: userInfo?.id || '',
    name: `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim(),
    email: userInfo?.email || '',
    role: userInfo?.role || '',
    status: userInfo?.isActive ? 'Active' : 'Inactive',
    joinDate: userInfo?.createdAt || '',
    institution: userInfo?.affiliation || '',
    specialty: userInfo?.expertise || 'N/A',
    orcid: userInfo?.orcid || '',
    country: userInfo?.country || '',
    bio: userInfo?.bio || '',
    expertise: userInfo?.expertise || 'N/A',
    totalSubmissions: userInfo?.articles?.length || 0,
    totalPublished: userInfo?.publishedArticles?.length || 0,
    avatar: userInfo?.avatar || null,
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

  const { mutate, isPending } = useDeactivateUser(user.id);

  const handleChangeUserInfo = () => {
    const payload = {
      role: selectedRole,
    };
    mutate(payload);
  };

  const handleStatusChange = () => {
    setShowStatusDialog(true);
  };

  const handleConfirmedStatusChange = () => {
    const newStatus = !userInfo?.isActive;
    const payload = {
      isActive: newStatus,
    };
    mutate(payload, {
      onSuccess: () => {
        setShowStatusDialog(false);
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>
          <div className="flex space-x-2">
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
                  <SheetDescription>
                    Change the role for {user.name}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Current Role
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {roleMap[user.role as string]}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">New Role</label>
                      <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a new role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL_USER">Author</SelectItem>
                          <SelectItem value="REVIEWER">Reviewer</SelectItem>
                          <SelectItem value="ASSOCIATE_EDITOR">
                            Editor
                          </SelectItem>
                          <SelectItem value="CHIEF_EDITOR">
                            Chief Editor
                          </SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
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
                      {isPending ? (
                        <Loader text="Changing..." />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Button
              onClick={handleStatusChange}
              disabled={isPending}
              className={`${
                userInfo?.isActive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <UserCog className="mr-2 h-5 w-5" />
              {isPending ? (
                <Loader
                  text={
                    userInfo?.isActive ? 'Deactivating...' : 'Activating...'
                  }
                />
              ) : (
                `${userInfo?.isActive ? 'Deactivate' : 'Activate'} User`
              )}
            </Button>
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
                      {roleMap[user.role as string]}
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
                    Total Submissions:
                  </span>
                  <span className="font-semibold">
                    {user.totalSubmissions ?? 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Published Articles:
                  </span>
                  <span className="font-semibold">
                    {user.totalPublished ?? 'N/A'}
                  </span>
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
          currentStatus={userInfo?.isActive}
          onConfirm={handleConfirmedStatusChange}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default UserDetail;
