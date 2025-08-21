'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users } from '@/db/schema';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { TableData } from '@/components/Table';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { roleMap } from '@/lib/utils';

const columns: ColumnDef<Users>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: 'createdAt',
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
    cell: ({ row }) => (
      <Badge variant={'secondary'}>
        {roleMap[row.getValue('role') as string]}
      </Badge>
    ),
  },
  {
    header: 'Actions',
    cell: ({ row }) => <ActionsButton row={row} />,
  },
];

const ActionsButton = ({ row }: { row: Row<Users> }) => {
  const router = useRouter();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
        onClick={() => router.push('/editor/users/' + String(row.original.id))}
      >
        <Eye className="h-4 w-4" />
        View
      </Button>
    </>
  );
};

interface ArticlesTableProps {
  data: Users[];
}

export const UserTable = ({ data }: ArticlesTableProps) => {
  return <TableData columns={columns} data={data} />;
};
