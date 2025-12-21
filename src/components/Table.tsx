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

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  UserCog,
  Users,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useAddToEditorialBoard,
  useRemoveFromEditorialBoard,
} from '@/hooks/useUsers';
import Loader from './Loader';
import { TUser } from '@/types';
import CreateUserSheet from './CreateUserSheet';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface Props<T> {
  data: TUser[];
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  columns: ColumnDef<TUser>[];
}

export const TableData = <T extends { role?: string }>({
  data,
  columns,
}: Props<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isCreateUserSheetOpen, setIsCreateUserSheetOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

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

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowIds = selectedRows
    .map((row: any) => row.original.id)
    .filter((id): id is string => id !== null);

  const { mutate: addToEditorialBoard, isPending: isAdding } =
    useAddToEditorialBoard();
  const { mutate: removeFromEditorialBoard, isPending: isRemoving } =
    useRemoveFromEditorialBoard();

  // Check if all selected users are in editorial board
  const areAllSelectedInEditorialBoard = useMemo(() => {
    if (selectedRows.length === 0) return false;
    return selectedRows.every((row: any) => {
      const user = row.original as TUser & { isPartOfEditorialBoard?: boolean };
      return user.isPartOfEditorialBoard === true;
    });
  }, [selectedRows]);

  const handleAddToEditorialBoard = () => {
    console.log({ selectedRowIds });
    addToEditorialBoard({ userIds: selectedRowIds });
  };

  const handleRemoveFromEditorialBoard = () => {
    removeFromEditorialBoard(
      { userIds: selectedRowIds },
      {
        onSuccess: () => {
          setIsRemoveDialogOpen(false);
          table.toggleAllPageRowsSelected(false);
        },
      }
    );
  };

  const handleButtonClick = () => {
    if (areAllSelectedInEditorialBoard) {
      setIsRemoveDialogOpen(true);
    } else {
      handleAddToEditorialBoard();
    }
  };

  const selectedCount = selectedRows.length;
  const hasSelected = selectedCount > 0;
  const isPending = isAdding || isRemoving;

  const roleOptions = ['ADMIN', 'ASSOCIATE_EDITOR', 'REVIEWER', 'NORMAL_USER'];

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="bg-gray-50 rounded-lg border p-4 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Left side: Search + Role Filter + Reset */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or affiliation..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Role Filter */}
            <Select
              value={
                (columnFilters.find((f: any) => f.id === 'role')
                  ?.value as string) ?? ''
              }
              onValueChange={(value) => {
                setColumnFilters((prev: any) =>
                  value
                    ? [
                        ...prev.filter((f: any) => f.id !== 'role'),
                        { id: 'role', value },
                      ]
                    : prev.filter((f: any) => f.id !== 'role')
                );
              }}
            >
              <SelectTrigger className="w-[200px] bg-white border-gray-200">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role
                      .replace('_', ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Editorial Board Filter */}
            <Select
              value={
                (columnFilters.find(
                  (f: any) => f.id === 'isPartOfEditorialBoard'
                )?.value as string) ?? ''
              }
              onValueChange={(value) => {
                setColumnFilters((prev: any) =>
                  value
                    ? [
                        ...prev.filter(
                          (f: any) => f.id !== 'isPartOfEditorialBoard'
                        ),
                        { id: 'isPartOfEditorialBoard', value },
                      ]
                    : prev.filter((f: any) => f.id !== 'isPartOfEditorialBoard')
                );
              }}
            >
              <SelectTrigger className="w-[220px] bg-white border-gray-200">
                <SelectValue placeholder="Filter by editorial board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Editorial Board Members</SelectItem>
                <SelectItem value="false">Non-Editorial Board</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
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
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 font-semibold">
              Total users: {table.getFilteredRowModel().rows.length}
            </div>
            <Button
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setIsCreateUserSheetOpen(true)}
            >
              Add New user
            </Button>
          </div>
        </div>
        {hasSelected && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleButtonClick}
                disabled={isPending}
                className={
                  areAllSelectedInEditorialBoard
                    ? 'bg-white border-red-300 text-red-700 hover:bg-red-50'
                    : 'bg-white border-green-300 text-green-700 hover:bg-green-50'
                }
              >
                <UserCog className="h-3 w-3" />
                {isPending ? (
                  <Loader
                    text={
                      areAllSelectedInEditorialBoard
                        ? 'Removing...'
                        : 'Adding...'
                    }
                  />
                ) : areAllSelectedInEditorialBoard ? (
                  'Remove from editorial board'
                ) : (
                  'Add to editorial board'
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
                    <Users className="h-8 w-8" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-gray-700">
              Showing {table.getRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} users
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
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
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
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <CreateUserSheet
        open={isCreateUserSheetOpen}
        onOpenChange={setIsCreateUserSheetOpen}
      />

      <AlertDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the selected user(s) from the editorial board
              members. This action can be undone by adding them back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              disabled={isRemoving}
              variant={'destructive'}
              onClick={handleRemoveFromEditorialBoard}
            >
              {isRemoving ? <Loader text="Removing..." /> : 'Yes, Remove'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
