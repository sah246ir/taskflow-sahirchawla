import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginSchemaType } from '@/schema/auth.schema'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/auth.service'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { toast } from 'sonner'
import { LoadingButton } from '@/components/ui/buttons/LoadingButton'

const index = () => {
  const {mutate:submit,isPending} = useMutation({
    mutationFn: login,
    onSuccess(data) {
        localStorage.setItem("token",data.data.token)
        toast.success("Login successful")
        window.location.href = "/"
    },
  })
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = (data: LoginSchemaType) => {
    submit(data)
  }
  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      <div className=' p-4 border border-blue-400 rounded-md min-w-[500px]'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormItem>
              <Label>Email</Label>
              <Input {...form.register('email')} />
            </FormItem>
            <FormItem>
              <Label>Password</Label>
              <Input {...form.register('password')} />
            </FormItem>
            <LoadingButton isLoading={isPending} className='mt-8' type='submit'>Login</LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default index
