'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Edit, X, Plus } from 'lucide-react';
import { roleMap } from '@/lib/utils';
import Loader from '@/components/Loader';
import { Separator } from '@/components/ui/separator';
import withPermissions from '../WithPermission';

const ChangeRole = ({
  handleChangeUserInfo,
  handleAddRole,
  handleRemoveRole,
  selectedRole,
  setSelectedRole,
  isPending,
  isAddingRolePending,
  isRemovingRolePending,
  userName,
  userRole,
  userRoles,
}: {
  handleChangeUserInfo: () => void;
  handleAddRole: (role: string, options?: any) => void;
  handleRemoveRole: (role: string) => void;
  selectedRole: string;
  setSelectedRole: Dispatch<SetStateAction<string>>;
  isPending: boolean;
  isAddingRolePending: boolean;
  isRemovingRolePending: boolean;
  userName: string;
  userRole: string;
  userRoles: Array<{ id: string; role: string }>;
}) => {
  const [roleToAdd, setRoleToAdd] = useState<string>('');

  const handleAddRoleClick = () => {
    if (!roleToAdd) return;
    handleAddRole(roleToAdd, {
      onSuccess: () => {
        setRoleToAdd('');
      },
    });
  };

  const availableRoles = [
    'NORMAL_USER',
    'REVIEWER',
    'ASSOCIATE_EDITOR',
    'STAFF_EDITOR',
    'CHIEF_EDITOR',
  ].filter((role) => !userRoles.some((userRole) => userRole.role === role));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Manage Roles
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Manage User Roles</SheetTitle>
          <SheetDescription>Manage roles for {userName}</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {/* Current Roles */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Roles
            </label>
            {userRoles && userRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userRoles.map((userRoleItem: { id: string; role: string }) => (
                  <Badge
                    key={userRoleItem.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {roleMap[userRoleItem.role]}
                    <button
                      onClick={() => handleRemoveRole(userRoleItem.role)}
                      disabled={isRemovingRolePending || userRoles.length <= 1}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        userRoles.length <= 1
                          ? 'Cannot remove the last role'
                          : 'Remove role'
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            )}
          </div>

          <Separator />

          {/* Add New Role */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Add New Role
            </label>
            <div className="space-y-3">
              <Select value={roleToAdd} onValueChange={setRoleToAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleMap[role]}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      All roles assigned
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {availableRoles.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  User has all available roles
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Change Primary Role (Legacy) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Change Primary Role (Legacy)
            </label>
            <div className="space-y-3">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a new primary role" />
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
              <p className="text-xs text-muted-foreground">
                Note: This updates the primary role. Use "Add New Role" to add
                additional roles.
              </p>
            </div>
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-row gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </SheetClose>
          {roleToAdd && (
            <Button
              onClick={handleAddRoleClick}
              disabled={!roleToAdd || isAddingRolePending}
              className="w-full sm:w-auto"
            >
              {isAddingRolePending ? (
                <Loader text="Adding..." />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </>
              )}
            </Button>
          )}
          {selectedRole && (
            <SheetClose asChild>
              <Button
                onClick={handleChangeUserInfo}
                disabled={!selectedRole || isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <Loader text="Changing..." />
                ) : (
                  'Update Primary Role'
                )}
              </Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const ChangeRoleWithPermission = withPermissions(ChangeRole);
