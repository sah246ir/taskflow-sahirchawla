import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Label } from '@/components/shadcn/label'
import { getProjectUsers } from '@/services/projects.service'
import type { ListTasksQuery } from '@/services/tasks.service'
import type { TaskPriority, TaskStatus } from '@/schema/common.schema'
import { useQuery } from '@tanstack/react-query'

const ALL = 'all'

type TaskFiltersToolbarProps = {
  projectId: string
  filters: Pick<ListTasksQuery, 'status' | 'priority' | 'assignee'>
  onFiltersChange: (next: Pick<ListTasksQuery, 'status' | 'priority' | 'assignee'>) => void
}

export function TaskFiltersToolbar({
  projectId,
  filters,
  onFiltersChange,
}: TaskFiltersToolbarProps) {
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['projectUsers', projectId],
    queryFn: () => getProjectUsers(projectId),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  })
  const users = usersRes?.data ?? []

  return (
    <div className="sm:flex grid grid-cols-1 w-full flex-wrap items-end gap-4">
      <div className="flex min-w-[140px] flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={filters.status ?? ALL}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              status: v === ALL ? undefined : (v as TaskStatus),
            })
          }
        >
          <SelectTrigger className="w-full min-w-[140px]" size="sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="todo">To do</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[140px] flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select
          value={filters.priority ?? ALL}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              priority: v === ALL ? undefined : (v as TaskPriority),
            })
          }
        >
          <SelectTrigger className="w-full min-w-[140px]" size="sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[180px] flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Assignee</Label>
        <Select
          value={filters.assignee ?? ALL}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              assignee: v === ALL ? undefined : v,
            })
          }
          disabled={usersLoading}
        >
          <SelectTrigger className="w-full min-w-[180px]" size="sm">
            <SelectValue placeholder={usersLoading ? 'Loading…' : 'Assignee'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All assignees</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
