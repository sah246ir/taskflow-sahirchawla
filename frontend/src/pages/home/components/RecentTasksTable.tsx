import { Badge, type BadgevariantType } from '@/components/shadcn/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import { ROUTES } from '@/config/routes'
import type { TaskPriority, TaskStatus } from '@/schema/common.schema'
import type { TaskListData } from '@/services/tasks.service'
import { formatDate } from '@/utils/date'
import { Link } from 'react-router-dom'

type RecentTasksTableProps = {
  tasks: TaskListData
  /** When true, show a Project column with links to the project detail page. */
  showProjectColumn: boolean
  title?: string
}

const taskStatusMap: Record<TaskStatus, { variant: BadgevariantType; label: string }> = {
  todo: { variant: 'default', label: 'Todo' },
  in_progress: { variant: 'warning', label: 'In progress' },
  done: { variant: 'success', label: 'Done' },
}

const taskPriorityMap: Record<TaskPriority, { variant: BadgevariantType; label: string }> = {
  low: { variant: 'default', label: 'Low' },
  medium: { variant: 'warning', label: 'Medium' },
  high: { variant: 'success', label: 'High' },
}

const projectHref = (id: string) => ROUTES.PROJECT_DETAIL.replace(':id', id)

export function RecentTasksTable({
  tasks,
  showProjectColumn,
  title = 'Recent tasks (last 5)',
}: RecentTasksTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No recent tasks.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {showProjectColumn ? <TableHead>Project</TableHead> : null}
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => {
              const st = taskStatusMap[t.status]
              const pr = taskPriorityMap[t.priority]
              return (
                <TableRow key={t.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">{t.title}</TableCell>
                  {showProjectColumn ? (
                    <TableCell>
                      {t.project?.id ? (
                        <Link
                          className="text-primary hover:underline"
                          to={projectHref(t.project.id)}
                        >
                          {t.project.name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pr.variant}>{pr.label}</Badge>
                  </TableCell>
                  <TableCell>{t.due_date ? formatDate(t.due_date) : '—'}</TableCell>
                  <TableCell>{t.assignee?.name ?? '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
