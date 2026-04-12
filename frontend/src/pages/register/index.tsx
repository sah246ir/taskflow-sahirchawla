import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterSchemaType } from '@/schema/auth.schema'
import { useMutation } from '@tanstack/react-query'
import { register as registerUser } from '@/services/auth.service'
import { Input } from '@/components/shadcn/input'
import { FormItem } from '@/components/ui/form/formItem'
import { Label } from '@/components/shadcn/label'
import { toast } from 'sonner'
import { LoadingButton } from '@/components/ui/buttons/LoadingButton'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import logo from '@/assets/logo.png'

const RegisterPage = () => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess(data) {
      localStorage.setItem('token', data.data.token)
      toast.success('Registration successful')
      window.location.href = '/'
    },
  })
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })
  const onSubmit = (data: RegisterSchemaType) => {
    submit(data)
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[90%] rounded-md border border-blue-400 p-4 md:w-[500px]">
        <img src={logo} alt="logo" width={155} className="mx-auto mb-6 block" />
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormItem>
              <Label>Name</Label>
              <Input {...form.register('name')} />
            </FormItem>
            <FormItem>
              <Label>Email</Label>
              <Input {...form.register('email')} />
            </FormItem>
            <FormItem>
              <Label>Password</Label>
              <Input type="password" {...form.register('password')} />
            </FormItem>
            <LoadingButton isLoading={isPending} className="mt-8" type="submit">
              Register
            </LoadingButton>
          </div>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-blue-600 underline hover:text-blue-800">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
