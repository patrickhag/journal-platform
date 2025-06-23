'use client';

import { StatusBadge } from '@/components/status-badge';
import TableData from '@/components/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users } from '@/db/schema';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis, Eye, User, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeactivateUserDialog } from './DeactivateAccountModal';
import { useDeactivateUser } from '@/hooks/useUsers';

const columns: ColumnDef<Users>[] = [
  {
    accessorKey: 'avatar',
    header: 'Picture',
    cell: ({ row }) => (
      <Avatar className="h-10 w-10 border-2 border-gray-100">
        <AvatarImage src={row.getValue('avatar')} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
          {(row.getValue('firstName') as string).at(0)}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue('firstName') || (
          <span className="text-red-600 text-sm italic">Not specified</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue('lastName') || (
          <span className="text-red-600 text-sm italic">Not specified</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="transition-colors">
        {row.getValue('email') || (
          <span className="text-red-600 text-sm italic">Not specified</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'affiliation',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Affiliation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700">
        {row.getValue('affiliation') || (
          <span className="text-red-600 text-sm italic">Not specified</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'joinedOn',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Joined On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const joinedDate = row.getValue('createdAt');
      if (!joinedDate) {
        return (
          <span className="text-red-600 text-sm italic">Not specified</span>
        );
      }
      const formattedDate = new Date(joinedDate as string).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );
      return <div className="text-gray-600 text-sm">{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <StatusBadge status={row.getValue('role')} />,
  },
  {
    header: 'Actions',
    cell: ({ row }) => <ActionsButton row={row} />,
  },
];

const ActionsButton = ({ row }: { row: Row<Users> }) => {
  const [openDeactivateAccountDialog, setOpenDeactivateAccountDialog] =
    useState(false);
  const [allowDeactivating, setAllowDeactivating] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleDeactivateAccount = () => {
    setOpenDeactivateAccountDialog(true);
  };

  const { mutate, isPending } = useDeactivateUser();
  const roles = ['ASSOCIATE_EDITOR', 'REVIEWER', 'NORMAL_USER'];

  const handleChangeRole = (role: string) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    if (allowDeactivating || selectedRole) {
      const data = {
        isActive: allowDeactivating,
        userId: row.original.id as string,
        role: selectedRole,
      };
      mutate({ data });
    }
  }, [allowDeactivating, selectedRole]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-3 hover:bg-gray-100 transition-colors"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem className="hover:bg-blue-50 transition-colors">
            <Eye className="mr-2 h-4 w-4 text-blue-600" />
            View user
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeactivateAccount}
            className="hover:bg-red-50 transition-colors"
          >
            <User className="mr-2 h-4 w-4 text-red-600" />
            {`${row.original.isActive ? 'Deactivate ' : 'Activate'} account`}
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-green-50 transition-colors">
              <Shield className="mr-2 h-4 w-4 text-green-600" />
              Change role
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleChangeRole(role)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {role
                      .replace('_', ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {openDeactivateAccountDialog && (
        <DeactivateUserDialog
          open={openDeactivateAccountDialog}
          onOpenChange={setOpenDeactivateAccountDialog}
          username={row.original.lastName as string}
          setAllowDeactivating={setAllowDeactivating}
          isDisablingPending={isPending}
        />
      )}
    </>
  );
};

interface ArticlesTableProps {
  data: Users[];
}

export const UserTable = ({ data }: ArticlesTableProps) => {
  return <TableData columns={columns} data={data} />;
};
