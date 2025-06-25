import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { editorialBoardMembers } from "@/db/schema";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";

interface EditorialBoardMembersTableProps {
  data: InferSelectModel<typeof editorialBoardMembers>[];
  onEdit: (member: InferSelectModel<typeof editorialBoardMembers>) => void;
  onDelete: (memberId: string) => void;
}

export const getColumns = (onEdit: EditorialBoardMembersTableProps["onEdit"], onDelete: EditorialBoardMembersTableProps["onDelete"]): ColumnDef<InferSelectModel<typeof editorialBoardMembers>>[] => {
  return [
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "affiliation",
      header: "Affiliation",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "areasOfExpertise",
      header: "Areas of Expertise",
    },
    {
      accessorKey: "photoUrl",
      header: "Photo URL",
    },
    {
      accessorKey: "orcidOrProfileUrl",
      header: "ORCID / Profile URL",
    },
    {
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => (row.original.isVisible ? "Yes" : "No"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(member.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
};

export function EditorialBoardMembersTable({
  data,
  onEdit,
  onDelete,
}: EditorialBoardMembersTableProps) {
  const table = useReactTable({
    data,
    columns: getColumns(onEdit, onDelete),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={getColumns(onEdit, onDelete).length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
