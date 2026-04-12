import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createProjectSchema,
  type CreateProjectSchemaType,
} from '@/schema/projects.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '@/services/projects.service'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { toast } from 'sonner'

type CreateProjectDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const CreateProjectDialog = ({
  isOpen,
  setOpen,
}: CreateProjectDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(createProjectSchema),
  })
  const { reset } = form

  useEffect(() => {
    if (!isOpen) {
      reset({ name: '', description: '' })
    }
  }, [isOpen, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project created successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpen(false)
    },
  })

  const onSubmit = (data: CreateProjectSchemaType) => {
    mutate({
      name: data.name,
      description: data.description?.trim() ? data.description : undefined,
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      setOpen={setOpen}
      title="Create project"
      description="Add a new project to your workspace."
      confirmText="Create project"
      cancelText="Cancel"
      isConfirmLoading={isPending}
      onConfirm={() => {
        void form.handleSubmit(onSubmit)()
      }}
    >
      <div className="flex flex-col gap-4">
        <FormItem>
          <Label>Name</Label>
          <Input {...form.register('name')} />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <Textarea rows={3} {...form.register('description')} />
        </FormItem>
      </div>
    </ConfirmDialog>
  )
}
