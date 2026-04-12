import type { ReactNode } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import { cn } from "@/lib/utils"

export type TableActionItem = {
  title: string
  onClick: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
}

type TableActionDropdownProps = {
  items: TableActionItem[]
}

export function TableActionDropdown({
  items,
}: TableActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${index}-${item.title}`}
            variant={item.variant ?? "default"}
            disabled={item.disabled}
            onSelect={() => {
              item.onClick()
            }}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
