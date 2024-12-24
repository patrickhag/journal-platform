'use client';
import { disactivateUser } from '@/actions/disactivateUser';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import withPermissions from '@/components/WithPermission';
import { Users } from '@/db/schema';
import { cn } from '@/lib/utils';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { startTransition, useState } from 'react';

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
    cell: ({ row }) =>
      row.getValue('avatar') ? (
        <Image
          src={row.getValue('avatar')}
          width={30}
          height={30}
          alt={row.getValue('firstName')}
        />
      ) : (
        <div>n/a</div>
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
        'ring-1 px-3 py-2 ring-gray-200 rounded-md',
        row.original.isActive ? 'bg-red-500' : 'bg-black'
      )}
    >
      {row.original.isActive ? 'Disactivate' : 'Activate'}
    </Button>
  </form>
);
const DisactivateUser = withPermissions(Disactivate);
interface ArticlesTableProps {
  data: Users[];
}

export const UserTable = ({ data }: ArticlesTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="py-5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              Total: {table.getFilteredRowModel().rows.length}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25, 30].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
