import { TableActionDropdown } from '@/components/ui/table/components/TableActionDropdown'
import { ROUTES } from '@/config/routes'
import { formatDate } from '@/utils/date'
import type { ProjectListData } from '@/services/projects.service'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

const projectDetailPath = (id: string) => ROUTES.PROJECT_DETAIL.replace(':id', id)

export const getProjectColumns = (
  onOpen: (project: ProjectListData) => void,
  onEdit: (project: ProjectListData) => void
): ColumnDef<ProjectListData>[] => [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={projectDetailPath(row.original.id)}
      >
        {row.original.name}
      </Link>
    ),
    size: 100,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => {
      const d = row.original.description?.trim()
      return d ? d : '—'
    },
    size: 130,
  },
  {
    header: 'Created',
    accessorKey: 'created_at',
    cell: ({ row }) => formatDate(row.original.created_at),
    size: 100,
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => (
      <TableActionDropdown
        items={[
          {
            title: 'Open',
            onClick: () => onOpen(row.original),
          },
          {
            title: 'Edit',
            onClick: () => onEdit(row.original),
          },
        ]}
      />
    ),
    size: 100,
  },
]
