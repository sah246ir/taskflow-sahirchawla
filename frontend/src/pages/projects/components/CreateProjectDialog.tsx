import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createProjectSchema,
  type CreateProjectSchemaType,
  type UpdateProjectSchemaType,
} from '@/schema/projects.schema'
import { useMutation, } from '@tanstack/react-query'
import { createProject, updateProject } from '@/services/projects.service'
import { ConfirmDialog } from '@/components/ui/dialogs/ConfirmDialog'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { toast } from 'sonner'
import { queryClient } from '@/config/queryClient'

type CreateProjectDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  id?: string
  initialValues?: UpdateProjectSchemaType
}

export const CreateProjectDialog = ({
  isOpen,
  setOpen,
  id,
  initialValues,
}: CreateProjectDialogProps) => { 
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

  useEffect(() => {
    if (initialValues) {
      reset({ name: initialValues.name, description: initialValues.description })
    }
  }, [initialValues, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project created successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpen(false)
    },
    onError: () => {
    }
  })
  const { mutate: updateProjectMutation, isPending: isUpdateProjectPending } = useMutation({
    mutationFn: ({projectId, data}: {projectId: string, data: UpdateProjectSchemaType}) => updateProject(projectId, data),
    onSuccess: () => {
      toast.success('Project updated successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpen(false)
    },
    onError: () => {
    }
  })

  const onSubmit = (data: CreateProjectSchemaType) => {
    if (id) {
      updateProjectMutation({ projectId: id, data: {
        name: data.name,
        description: data.description?.trim() ? data.description : undefined,
      } })
    } else {
      mutate({
      name: data.name,
      description: data.description?.trim() ? data.description : undefined,
    })
  }
  }
  const { errors } = form.formState
  return (
    <ConfirmDialog
      isOpen={isOpen}
      setOpen={setOpen}
      title={id ? 'Update project' : 'Create project'}
      description={id ? 'Update the project details' : 'Add a new project to your workspace.'}
      confirmText={id ? 'Update project' : 'Create project'}
      cancelText="Cancel"
      isConfirmLoading={isPending || isUpdateProjectPending}
      onConfirm={() => {
        void form.handleSubmit(onSubmit)()
      }}
    >
      <div className="flex flex-col gap-4">
        <FormItem error={errors.name?.message}>
          <Label>Name</Label>
          <Input {...form.register('name')} />
        </FormItem>
        <FormItem error={errors.description?.message}>
          <Label>Description</Label>
          <Textarea rows={3} {...form.register('description')} />
        </FormItem>
      </div>
    </ConfirmDialog>
  )
}
