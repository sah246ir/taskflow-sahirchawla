import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createTaskRequestSchema,
  type CreateTaskRequest,
} from '@/schema/tasks.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/services/tasks.service'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { toast } from 'sonner'

type CreateTaskDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  projectId: string
}

export const CreateTaskDialog = ({
  isOpen,
  setOpen,
  projectId,
}: CreateTaskDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(createTaskRequestSchema),
  })
  const { reset } = form

  useEffect(() => {
    if (!isOpen) {
      reset({ title: '', description: '' })
    }
  }, [isOpen, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: (body: CreateTaskRequest) => createTask(projectId, body),
    onSuccess: () => {
      toast.success('Task created')
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setOpen(false)
    },
  })

  const onSubmit = (data: CreateTaskRequest) => {
    mutate({
      title: data.title,
      description: data.description?.trim() ? data.description : undefined,
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
      </div>
    </ConfirmDialog>
  )
}
