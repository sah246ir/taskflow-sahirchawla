import { PageLayout } from '@/layouts/PageLayout'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PaginationState } from '@tanstack/react-table'
import { Button } from '@/components/shadcn/button'
import { CreateTaskDialog } from './components/CreateTaskDialog'
import { TaskFiltersToolbar } from './components/TaskFiltersToolbar'
import {
  deleteTask,
  listTasks,
  updateTask,
  type ListTasksQuery,
  type TaskListData,
} from '@/services/tasks.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/table/DataTable'
import { getTaskColumns } from './constants'
import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import type {  updateTaskSchemaType } from '@/schema/tasks.schema'
import { queryClient } from '@/config/queryClient'
import { toast } from 'sonner'
import type { TaskPriority, TaskStatus } from '@/schema/common.schema'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
const ProjectTasksPage = () => {
  const { id: projectId } = useParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)
  const [taskAction, setTaskAction] = useState<{action: 'edit' | 'delete', task: TaskListData[number]} | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [taskFilters, setTaskFilters] = useState<
    Pick<ListTasksQuery, 'status' | 'priority' | 'assignee'>
  >({})

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 })
    setTaskFilters({})
  }, [projectId])

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: [
      'tasks',
      projectId,
      pagination.pageIndex,
      pagination.pageSize,
      taskFilters.status,
      taskFilters.priority,
      taskFilters.assignee,
    ],
    queryFn: () =>
      listTasks(projectId!, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(taskFilters.status ? { status: taskFilters.status } : {}),
        ...(taskFilters.priority ? { priority: taskFilters.priority } : {}),
        ...(taskFilters.assignee ? { assignee: taskFilters.assignee } : {}),
      }),
    enabled: Boolean(projectId),
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
  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({body, taskId}: {body: updateTaskSchemaType, taskId: string}) => updateTask(taskId, body),
    onSuccess: () => {
      toast.success('Task updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId], exact: false })
      refetch()
    },
  })
  const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      toast.success('Task deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId], exact: false })
      refetch()
      setTaskAction(null)
    },
    onError: () => {
      toast.error('Could not delete this task. Try again.')
    },
  })
  const onAction = (task: TaskListData[number], action: 'edit' | 'delete') => {
    setTaskAction({action, task})
  } 

  const taskColumns = getTaskColumns(
    onAction,
    (taskId: string, status: TaskStatus) => updateTaskMutation({body:{status},taskId}),
    (taskId: string, priority: TaskPriority) => updateTaskMutation({body: {priority}, taskId}),
  )
  return (
    <PageLayout title="Project tasks" description="Tasks for this project.">
      <CardWrapper>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          {projectId ? (
            <TaskFiltersToolbar
              projectId={projectId}
              filters={taskFilters}
              onFiltersChange={(next) => {
                setTaskFilters(next)
                setPagination((p) => ({ ...p, pageIndex: 0 }))
              }}
            />
          ) : (
            <div />
          )}
          <Button
            type="button"
            disabled={!projectId}
            onClick={() => setCreateOpen(true)}
          >
            New task
          </Button>
        </div>
        <DataTable
        columns={taskColumns}
        data={data?.data.tasks || []}
        manualPagination
        pageCount={Math.max(1, data?.data.meta?.totalPages ?? 1)}
        pagination={pagination}
        onPaginationChange={setPagination}
        fallback={{
          title: 'No tasks found',
          description: 'Create a new task to get started.',
          cta: <Button onClick={() => setCreateOpen(true)}>Create task</Button>
        }}
        isLoading={isLoading}
        />
      </CardWrapper>

      {projectId ? (
        <>
        <CreateTaskDialog
          isOpen={createOpen || taskAction?.action=="edit"}
          setOpen={() => {
            setCreateOpen(false)
            setTaskAction(null)
          }}
          projectId={projectId}
          initialValues={taskAction?.task}
          taskId={taskAction?.task?.id}
        />

        <ConfirmDialog
          title='Confirm Delete'
          description='Are you sure you want to delete this task?'
          isOpen={taskAction?.action === "delete"}
          setOpen={() => setTaskAction(null)}
          confirmText='Delete'
          cancelText='Cancel'
          onConfirm={() => {
            const id = taskAction?.task?.id
            if (id) deleteTaskMutation(id)
          }}
          isConfirmLoading={isDeleting}
        >
          the selected task '{taskAction?.task?.title}' will be deleted permanently.
        </ConfirmDialog>
   
        </>
      ) : null}
    </PageLayout>
  )
}

export default ProjectTasksPage
