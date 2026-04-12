import { PageLayout } from '@/layouts/PageLayout'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PaginationState } from '@tanstack/react-table'
import { Button } from '@/components/shadcn/button'
import { CreateProjectDialog } from './components/CreateProjectDialog'
import { getProjectColumns } from './constants'
import { listProjects, type ProjectListData } from '@/services/projects.service'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/table/DataTable'
import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import { ROUTES } from '@/config/routes'
import { Typeface } from '@/components/ui/typeface'

const toProjectDetail = (id: string) => ROUTES.PROJECT_DETAIL.replace(':id', id)

const ProjectsPage = () => {
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectListData | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['projects', 'list', pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      listProjects({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  })

  useEffect(() => {
    if (!data?.data.meta || isFetching) return
    const m = data.data.meta
    setPagination((prev) => {
      const pageIndex =
        m.totalPages <= 0 ? 0 : Math.min(Math.max(0, m.page - 1), m.totalPages - 1)
      const next = { pageIndex, pageSize: m.limit }
      if (prev.pageIndex === next.pageIndex && prev.pageSize === next.pageSize) return prev
      return next
    })
  }, [data?.data.meta, isFetching])

  const onOpenProject = (project: ProjectListData) => {
    navigate(toProjectDetail(project.id))
  }

  const onEditProject = (project: ProjectListData) => {
    setCreateOpen(false)
    setEditingProject(project)
  }

  const projectDialogOpen = createOpen || editingProject !== null
  const setProjectDialogOpen = (open: boolean) => {
    if (!open) {
      setCreateOpen(false)
      setEditingProject(null)
    }
  }

  const columns = getProjectColumns(onOpenProject, onEditProject)

  return (
    <PageLayout title="Projects" description="Manage your projects.">
      <CardWrapper className='p-4'>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Typeface color='primary' size='lg' as='h1' variant='medium'>
            All Projects
          </Typeface>
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
          >
            New project
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data?.data.projects ?? []}
          manualPagination
          pageCount={Math.max(1, data?.data.meta?.totalPages ?? 1)}
          pagination={pagination}
          onPaginationChange={setPagination}
          fallback={{
            title: 'No projects yet',
            description: 'Create a project to organize your tasks.',
            cta: (
              <Button
                onClick={() => {
                  setEditingProject(null)
                  setCreateOpen(true)
                }}
              >
                Create project
              </Button>
            ),
          }}
          isLoading={isLoading}
        />
      </CardWrapper>
      <CreateProjectDialog
        isOpen={projectDialogOpen}
        setOpen={setProjectDialogOpen}
        id={editingProject?.id}
        initialValues={
          editingProject
            ? { name: editingProject.name, description: editingProject.description }
            : undefined
        }
      />
    </PageLayout>
  )
}

export default ProjectsPage
