import { PageLayout } from '@/layouts/PageLayout'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/shadcn/button'
import { CreateTaskDialog } from './components/CreateTaskDialog'
import { deleteTask, listTasks, updateTask, type TaskListData } from '@/services/tasks.service'
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
  const { data,refetch, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => listTasks(projectId),
  })
  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({body, taskId}: {body: updateTaskSchemaType, taskId: string}) => updateTask(taskId, body),
    onSuccess: () => {
      toast.success('Task updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      refetch()
    },
  })
  const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      toast.success('Task deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
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
        <div className="flex justify-end mb-4">
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
          onConfirm={() => deleteTaskMutation(taskAction?.task?.id)}
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
