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
  FileHeart,
  ChevronDown,
  FileText,
  CheckCircle,
  RotateCcw,
  Search,
  Eye,
  FileStack,
} from 'lucide-react';
import { StatusBadge } from './status-badge';

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
import { useEditorsPick } from '@/hooks/useSettings';
import { useRouter } from 'next/navigation';
import {
  useAssignCollectionArticles,
  useGetCollections,
} from '@/hooks/useCollections';

type Article = {
  id: string | null;
  section: string | null;
  status: string | null;
  owner: string | null;
  createdAt: string | null;
  title: string | null;
};

interface ArticlesTableProps {
  data: Article[];
}

export const ArticlesTable: FC<ArticlesTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: issues } = useGetIssues();
  const router = useRouter();

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
          className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="max-w-md">
          <div
            className="font-semibold text-gray-900 truncate"
            title={row.getValue('title')}
          >
            {row.getValue('title') || (
              <span className="text-red-600 text-sm italic">Not specified</span>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'section',
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Section
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {row.getValue('section') || (
            <span className="text-red-600 text-sm italic">Not specified</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'owner',
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.getValue('owner') || (
            <span className="text-red-600 text-sm italic">Not specified</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const createdDate = row.getValue('createdAt');
        if (!createdDate) {
          return (
            <span className="text-red-600 text-sm italic">Not specified</span>
          );
        }
        const formattedDate = new Date(
          createdDate as string
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        return <div className="text-gray-600 text-sm">{formattedDate}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          onClick={() => router.push('/articles/' + String(row.original.id))}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

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

  const { mutate: assignIssuesMutation, isPending: isAssigningIssuePending } =
    useAssignIssues();
  const { data: collections } = useGetCollections();

  const {
    mutate: pickArticlesMutation,
    isPending: isPickArticlesMutationPending,
  } = useEditorsPick();

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowIds = selectedRows
    .map((row) => row.original.id)
    .filter((id): id is string => id !== null);

  const handlePickArticle = () => {
    pickArticlesMutation({ articleIds: selectedRowIds });
  };

  const {
    mutate: assignCollectionsMutation,
    isPending: isAssigningCollectionPending,
  } = useAssignCollectionArticles();

  const handleIssueAssertion = (issueId: string) => {
    assignIssuesMutation({ articleIds: selectedRowIds, issueId });
  };

  const handleCollectionAssertion = (collectionId: string) => {
    assignCollectionsMutation({ articleIds: selectedRowIds, collectionId });
  };

  const selectedCount = selectedRows.length;
  const hasSelected = selectedCount > 0;

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="bg-gray-50 rounded-lg border p-4 space-y-4">
        <div className="flex justify-between items-center">
          {/* Search and Filter Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles by title, section, or owner..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

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
              <SelectTrigger className="w-[180px] bg-white border-gray-200">
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
                setGlobalFilter('');
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>

          <div className="text-sm text-gray-500 font-semibold">
            Total articles: {table.getFilteredRowModel().rows.length}
          </div>
        </div>
        {/* Action Buttons Row */}

        {hasSelected && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {selectedCount} article{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isAssigningCollectionPending}
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <FolderPlus className="h-3 w-3" />
                    {isAssigningCollectionPending ? (
                      <Loader text="Assigning..." />
                    ) : (
                      'Assign collections'
                    )}
                    <ChevronDown className="h-3 w-3 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuSeparator />
                  {collections?.map((collection, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleCollectionAssertion(collection.id)}
                      className="hover:bg-blue-50"
                    >
                      <FileStack className="h-4 w-4 mr-2" />
                      Collection {collection.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isAssigningIssuePending}
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <FolderPlus className="h-3 w-3" />
                    {isAssigningIssuePending ? (
                      <Loader text="Assigning..." />
                    ) : (
                      'Assign Issues'
                    )}
                    <ChevronDown className="h-3 w-3 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuSeparator />
                  {issues?.map((issue, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleIssueAssertion(issue.id)}
                      className="hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Issue {issue.issueNumber}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePickArticle}
                disabled={isPickArticlesMutationPending}
                className="bg-white border-green-300 text-green-700 hover:bg-green-50"
              >
                <FileHeart className="h-3 w-3" />
                {isPickArticlesMutationPending ? (
                  <Loader text="Picking..." />
                ) : (
                  'Pick Articles'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-700 py-4 px-6"
                  >
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`
                    hover:bg-gray-50 transition-colors border-b border-gray-100
                    ${row.getIsSelected() ? 'bg-blue-50 border-blue-200' : ''}
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-6">
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <FileText className="h-8 w-8" />
                    <p className="text-lg font-medium">No articles found</p>
                    <p className="text-sm">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Showing {table.getRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} articles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Rows per page:
              </span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px] bg-white border-gray-300">
                  <SelectValue />
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
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
