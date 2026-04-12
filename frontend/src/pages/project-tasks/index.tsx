import { PageLayout } from '@/layouts/PageLayout'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/shadcn/button'
import { CreateTaskDialog } from './components/CreateTaskDialog'
import { listTasks, updateTask, type TaskListData } from '@/services/tasks.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/table/DataTable'
import { getTaskColumns } from './constants'
import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import type { createTaskSchemaType, updateTaskSchemaType } from '@/schema/tasks.schema'
import { queryClient } from '@/config/queryClient'
import { toast } from 'sonner'
import type { TaskPriority, TaskStatus } from '@/schema/common.schema'

const ProjectTasksPage = () => {
  const { id: projectId } = useParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)
  const [taskAction, setTaskAction] = useState<{action: 'edit' | 'delete', task: TaskListData[number]} | null>(null)
  const { data,refetch } = useQuery({
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
        />
      </CardWrapper>

      {projectId ? (
        <CreateTaskDialog
          isOpen={createOpen || !!taskAction}
          setOpen={() => {
            setCreateOpen(false)
            setTaskAction(null)
          }}
          projectId={projectId}
          initialValues={taskAction?.task}
          taskId={taskAction?.task?.id}
        />
      ) : null}
    </PageLayout>
  )
}

export default ProjectTasksPage
