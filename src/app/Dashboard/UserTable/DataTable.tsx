"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  filterFns,
  useReactTable,
} from "@tanstack/react-table";
import { utils, writeFile } from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTableFacetedFilter from "./DataTableFacetedFilter";
import { trialOptions, subscribedOptions, statusOptions } from "./options";
import { DateRange } from "./DateRange";
import { Download } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    data: TData[];
    activeSubscriptionCount: number;
    trialUsersCount: number;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: filterFns.includesString,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  const exportToExcel = () => {
    // Convert table data to a worksheet
    const filteredRows = table.getFilteredRowModel().rows;
    const filteredData = filteredRows.map((row) => row.original);
    const worksheet = utils.json_to_sheet(filteredData);

    // Create a workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the workbook
    writeFile(workbook, "users-data.xlsx");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center pb-4">
        <Input
          placeholder="Filter..."
          value={globalFilter}
          onChange={(e: any) => table.setGlobalFilter(String(e.target.value))}
          className="max-w-[300px] min-w-[100px] h-8"
        />
        <DateRange table={table} />
        <DataTableFacetedFilter
          column={table.getColumn("isontrial")}
          title="Trial"
          options={trialOptions}
        />
        <DataTableFacetedFilter
          column={table.getColumn("subscribed")}
          title="Subscribed"
          options={subscribedOptions}
        />
        <DataTableFacetedFilter
          column={table.getColumn("subscription_status")}
          title="Subscription Status"
          options={statusOptions}
        />
        <Button className="h-8" onClick={exportToExcel}>
          Download CSV <Download className="w-4 h-4 ml-2" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="ml-auto h-8">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
