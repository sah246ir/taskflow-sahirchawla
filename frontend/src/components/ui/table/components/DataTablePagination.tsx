import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/shadcn/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
}

export function DataTablePagination<TData>({
  table,
  className,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  const { pageIndex, pageSize } = table.getState().pagination

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t bg-white py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 px-4 rounded-b-md",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground whitespace-nowrap">
          Rows per page
        </span>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger size="sm" className="h-8 w-18">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-1">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 px-1">
          {[pageIndex - 1, pageIndex, pageIndex + 1]
            .filter((page) => page >= 0 && page < pageCount)
            .map((page) => (
              <Button
                key={page}
                type="button"
                variant={pageIndex === page ? "default" : "outline"}
                size="icon"
                className="size-8 min-w-8"
                onClick={() => table.setPageIndex(page)}
                aria-label={`Page ${page + 1}`}
                aria-current={pageIndex === page ? "page" : undefined}
              >
                {page + 1}
              </Button>
            ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(Math.max(0, pageCount - 1))}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
