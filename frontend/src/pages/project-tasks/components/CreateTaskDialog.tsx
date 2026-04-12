import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createTaskSchema,
  type createTaskSchemaType
} from '@/schema/tasks.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/services/tasks.service'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const selectClassName = cn(
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30'
)

type CreateTaskDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  projectId: string
}

const defaultFormValues: createTaskSchemaType = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
}

export const CreateTaskDialog = ({
  isOpen,
  setOpen,
  projectId,
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

  const { mutate, isPending } = useMutation({
    mutationFn: (body: createTaskSchemaType) => createTask(projectId, body),
    onSuccess: () => {
      toast.success('Task created')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setOpen(false)
    },
  })

  const onSubmit = (data: createTaskSchemaType) => {
    mutate({
      title: data.title,
      description: data.description?.trim() ? data.description : undefined,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date,
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      setOpen={setOpen}
      title="Create task"
      description="Add a new task to this project."
      confirmText="Create task"
      cancelText="Cancel"
      isConfirmLoading={isPending}
      onConfirm={() => {
        void form.handleSubmit(onSubmit)()
      }}
    >
      <div className="flex flex-col gap-4">
        <FormItem>
          <Label>Title</Label>
          <Input {...form.register('title')} />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <Textarea rows={3} {...form.register('description')} />
        </FormItem>
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <Label>Status</Label>
            <select className={selectClassName} {...form.register('status')}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </FormItem>
          <FormItem>
            <Label>Priority</Label>
            <select className={selectClassName} {...form.register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormItem>
          <FormItem>
            <Label>Due date</Label>
            <Input type="date" {...form.register('due_date')} />
          </FormItem>
        </div>
      </div>
    </ConfirmDialog>
  )
}
