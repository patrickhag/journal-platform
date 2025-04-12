'use client';

import { FC, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FolderPlus,
} from 'lucide-react';
import { StatusBadge } from './status-badge';
import Link from 'next/link';
import { Checkbox } from './ui/checkbox';
import { ARTICLE_STATUS } from '@/lib/consts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAssignIssues, useGetIssues } from '@/hooks/useIssues';
import Loader from './Loader';

type Article = {
  id: string | null;
  section: string | null;
  status: string | null;
  owner: string | null;
  createdAt: string | null;
  title: string | null;
};

const columns: ColumnDef<Article>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <div
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: 'section',
    header: 'Section',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant={'outline'}>
        <Link href={'/articles/' + String(row.original.id)}>View</Link>
      </Button>
    ),
  },
];

interface ArticlesTableProps {
  data: Article[];
}

export const ArticlesTable: FC<ArticlesTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: issues } = useGetIssues();

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
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const { mutate, isPending } = useAssignIssues();

  const handleIssueAssertion = (issueId: string) => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedRowIds = selectedRows
      .map((row) => row.original.id)
      .filter((id): id is string => id !== null);
    mutate({ articleIds: selectedRowIds, issueId });
  };

  return (
    <div className="space-y-4">
      {/* Search and Assign Button Row */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search article..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Filter by Status Dropdown */}
        <Select
          value={
            (columnFilters.find((filter) => filter.id === 'status')
              ?.value as string) ?? ''
          }
          onValueChange={(value) => {
            setColumnFilters((prev) =>
              value
                ? [
                    ...prev.filter((f) => f.id !== 'status'),
                    { id: 'status', value },
                  ]
                : prev.filter((f) => f.id !== 'status')
            );
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ARTICLE_STATUS.map((article) => (
              <SelectItem key={article} value={article}>
                {article}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            table.resetColumnFilters();
            table.toggleAllPageRowsSelected(false);
          }}
        >
          Reset Filters
        </Button>

        {/* Assign Articles Button */}
        {(table.getIsSomePageRowsSelected() ||
          table.getIsAllPageRowsSelected()) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FolderPlus />
                {isPending ? <Loader text="Assigning..." /> : 'Assign Issues'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              {issues?.map((issue, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleIssueAssertion(issue.id)}
                >
                  Issue {issue.issueNumber}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
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
                  className="py-5 border-b w-10 h-10"
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
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
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
  );
};
