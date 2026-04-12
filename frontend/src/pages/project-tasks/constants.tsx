import { Badge, type BadgevariantType } from "@/components/shadcn/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { TableActionDropdown } from "@/components/ui/table/components/TableActionDropdown";
import type { TaskPriority, TaskStatus } from "@/schema/common.schema";
import type { TaskListData } from "@/services/tasks.service";
import { formatDate } from "@/utils/date";
import type { ColumnDef } from "@tanstack/react-table";

const taskStatusMap: Record<TaskStatus, {variant: BadgevariantType,label: string}> = {
  "todo": {variant: 'default', label: 'Todo'},
  "in_progress": {variant: 'warning', label: 'In Progress'},
  "done": {variant: 'success', label: 'Done'},
}
const taskPriorityMap: Record<TaskPriority, {variant: BadgevariantType,label: string}> = {
  "low": {variant: 'default', label: 'Low'},
  "medium": {variant: 'warning', label: 'Medium'},
  "high": {variant: 'success', label: 'High'},
}
export const getTaskColumns = (
  onAction: (task: TaskListData[number],action: 'edit' | 'delete') => void,
  onStatusChange: (taskId: string, status: TaskStatus) => void,
  onPriorityChange: (taskId: string, priority: TaskPriority) => void,
):
ColumnDef<TaskListData[number]>[] => 
  [
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Due Date',
    accessorKey: 'due_date',
    cell: ({ row }) => row.original.due_date ? formatDate(row.original.due_date) : '-',
  },
  {
    header: 'Priority',
    accessorKey: 'priority',
    cell: ({ row }) => {
      const priority = row.original.priority
      const {variant, label} = taskPriorityMap[priority]
      return(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Badge className="cursor-pointer" variant={variant}>{label}</Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onPriorityChange(row.original.id, 'low')}>Low</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange(row.original.id, 'medium')}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange(row.original.id, 'high')}>High</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status
      const {variant, label} = taskStatusMap[status]
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Badge className="cursor-pointer" variant={variant}>{label}</Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStatusChange(row.original.id, 'todo')}>Todo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(row.original.id, 'in_progress')}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(row.original.id, 'done')}>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => {
      return <TableActionDropdown items={[{ title: 'Edit', onClick: () => onAction(row.original, 'edit') }, { title: 'Delete', onClick: () => onAction(row.original, 'delete') }]} />
    },
  },
]