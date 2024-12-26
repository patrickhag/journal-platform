'use client';
import { disactivateUser } from '@/actions/disactivateUser';
import { StatusBadge } from '@/components/status-badge';
import TableData from '@/components/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import withPermissions from '@/components/WithPermission';
import { Users } from '@/db/schema';
import { cn } from '@/lib/utils';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { startTransition } from 'react';

const columns: ColumnDef<Users>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },

  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'affiliation',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Affiliation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },

  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },

  {
    accessorKey: 'avatar',
    header: 'Picture',
    cell: ({ row }) => (
      <Avatar className="h-5 w-5">
        <AvatarImage src={row.getValue('avatar')} />

        <AvatarFallback className="bg-white text-xl font-bold text-gray-500">
          {(row.getValue('firstName') as string).at(0)}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <StatusBadge status={row.getValue('role')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DisactivateUser
        row={row}
        role="ADMIN"
        requiredPermissions={['MANAGE_USERS']}
        fallback=""
      />
    ),
  },
];

const Disactivate = ({ row }: { row: Row<Users> }) => (
  <form
    action={() => {
      startTransition(() => {
        disactivateUser(row.original.id, row.original.isActive);
      });
    }}
  >
    <Button
      className={cn(
        'px-2 py-1 ring-gray-200 rounded-md text-sm',
        row.original.isActive
          ? 'hover:border-red-500 hover:text-red-500'
          : 'hover:border-green-500 hover:text-green-500'
      )}
      variant={'outline'}
    >
      {row.original.isActive ? 'Deactivate' : 'Activate'}
    </Button>
  </form>
);

const DisactivateUser = withPermissions(Disactivate);
interface ArticlesTableProps {
  data: Users[];
}

export const UserTable = ({ data }: ArticlesTableProps) => {
  return <TableData columns={columns} data={data} />;
};

export const UsersTable = withPermissions(UserTable);
