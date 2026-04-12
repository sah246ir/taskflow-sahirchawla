import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table"
import TableFallback from "./components/TableFallback"
import TableLoader from "./components/TableLoader"
import { DataTablePagination } from "./components/DataTablePagination"

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  filterColumnKey?: keyof TData
  manualPagination?: boolean
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void,
  fallback?:{
    title: string
    description?: string
    cta?: React.ReactNode
  }
  isLoading?: boolean
}

export function DataTable<TData>({
  columns,
  data,
  fallback,
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const paginationState =
    pagination !== undefined ? pagination : internalPagination

  const handlePaginationChange = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(paginationState)
          : updaterOrValue
      onPaginationChange?.(next)
      if (pagination === undefined) {
        setInternalPagination(next)
      }
    },
    [pagination, paginationState, onPaginationChange]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: manualPagination ? pageCount : undefined,
    manualPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-t-md">
        <Table className="bg-white border-0 table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead style={{ width: header.getSize() }} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length && !isLoading ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {
                    isLoading ? (
                      <TableLoader />
                    ) : (
                      <TableFallback
                        title={fallback?.title ?? "No data"}
                        description={fallback?.description}
                        cta={fallback?.cta}
                      />
                    )
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getRowModel().rows.length ? <DataTablePagination table={table} /> : null}
    </div>
  )
}
