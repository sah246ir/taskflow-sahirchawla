import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createTaskSchema,
  type createTaskSchemaType,
} from '@/schema/tasks.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask } from '@/services/tasks.service'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { type TaskPriority, type TaskStatus } from '@/schema/common.schema'

type CreateTaskDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  projectId: string
  initialValues?: createTaskSchemaType
  taskId?: string
}

const defaultFormValues: createTaskSchemaType = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
}

export const CreateTaskDialog = ({
  isOpen,
  setOpen,
  projectId,
  initialValues,
  taskId
}: CreateTaskDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm<createTaskSchemaType, unknown, createTaskSchemaType>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(createTaskSchema),
  })
  const { reset } = form

  useEffect(() => {
    if (!isOpen) {
      reset(defaultFormValues)
    }
  }, [isOpen, reset])

  const { errors } = form.formState

  const { mutate, isPending } = useMutation({
    mutationFn: (body: createTaskSchemaType) => createTask(projectId, body),
    onSuccess: () => {
      toast.success('Task created')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setOpen(false)
    },
  })
  const { mutate: updateTaskMutation, isPending: isUpdatePending } = useMutation({
    mutationFn: (body: createTaskSchemaType) => updateTask(taskId, body),
    onSuccess: () => {
      toast.success('Task updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setOpen(false)
    },
  })

  const onSubmit = (data: createTaskSchemaType) => {
    if (taskId) {
      updateTaskMutation({
        title: data.title,
        description: data.description?.trim() ? data.description : undefined,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
      })
    } else {
      mutate({
        title: data.title,
        description: data.description?.trim() ? data.description : undefined,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
      })
    }
  }

  useEffect(() => {
    if (initialValues) {
      reset(initialValues)
    }
  }, [initialValues, taskId, reset])

  return (
    <ConfirmDialog
      isOpen={isOpen}
      setOpen={setOpen}
      title={taskId ? "Update task" : "Create task"}
      description={taskId ? "Update the task details." : "Add a new task to this project."}
      confirmText={taskId ? "Update task" : "Create task"}
      cancelText="Cancel"
      isConfirmLoading={isPending || isUpdatePending}
      onConfirm={() => {
        void form.handleSubmit(onSubmit)()
      }}
    >
      <div className="flex flex-col gap-4">
        <FormItem error={errors.title?.message}>
          <Label>Title</Label>
          <Input {...form.register('title')} />
        </FormItem>
        <FormItem error={errors.description?.message}>
          <Label>Description</Label>
          <Textarea rows={3} {...form.register('description')} />
        </FormItem>
        <div className="grid grid-cols-2 gap-4">
          <FormItem error={errors.status?.message}>
            <Label>Status</Label>
            <Select
              onValueChange={(value) => form.setValue('status', value as TaskStatus)}
              value={form.watch('status')}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To do</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          <FormItem error={errors.priority?.message}>
            <Label>Priority</Label>
            <Select
              onValueChange={(value) => form.setValue('priority', value as TaskPriority)}
              value={form.watch('priority')}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          <FormItem error={errors.due_date?.message}>
            <Label>Due date</Label>
            <Input type="date" {...form.register('due_date')} />
          </FormItem>
        </div>
      </div>
    </ConfirmDialog>
  )
}
