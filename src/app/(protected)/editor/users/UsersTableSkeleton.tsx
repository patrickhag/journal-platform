import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Controls Section Skeleton */}
      <div className="bg-gray-50 rounded-lg border p-4 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Left side: Search + Role Filter + Reset */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <Skeleton className="h-10 w-64" />

            {/* Role Filter */}
            <Skeleton className="h-10 w-[200px]" />

            {/* Editorial Board Filter */}
            <Skeleton className="h-10 w-[220px]" />

            {/* Reset Button */}
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-[70px]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
