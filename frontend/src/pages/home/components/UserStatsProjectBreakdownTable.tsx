import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import { ROUTES } from '@/config/routes'
import type { UserStatsByProject } from '@/services/auth.service'
import { Link } from 'react-router-dom'

type UserStatsProjectBreakdownTableProps = {
  rows: UserStatsByProject[]
}

const projectHref = (id: string) => ROUTES.PROJECT_DETAIL.replace(':id', id)

export function UserStatsProjectBreakdownTable({ rows }: UserStatsProjectBreakdownTableProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No assigned tasks yet. When you are assigned tasks, a per-project breakdown will appear here.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="text-right tabular-nums">To do</TableHead>
          <TableHead className="text-right tabular-nums">In progress</TableHead>
          <TableHead className="text-right tabular-nums">Done</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.projectId}>
            <TableCell>
              <Link
                className="font-medium text-primary hover:underline"
                to={projectHref(r.projectId)}
              >
                {r.projectName}
              </Link>
            </TableCell>
            <TableCell className="text-right tabular-nums">{r.todo}</TableCell>
            <TableCell className="text-right tabular-nums">{r.in_progress}</TableCell>
            <TableCell className="text-right tabular-nums">{r.done}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
