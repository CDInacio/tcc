import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useSignup } from '@/hooks/use-signup.hook'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link } from 'react-router-dom'

const userFormSchema = z.object({
  fullname: z.string().min(3, { message: 'Campo obrigatório' }),
  document: z
    .string()
    .min(3, { message: 'Campo obrigatório' })
    .refine(
      (value) => {
        const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/
        const rgRegex = /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[a-zA-Z0-9]{1}$/
        return cpfRegex.test(value) || rgRegex.test(value)
      },
      { message: 'Documento inválido' }
    ),
  email: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z.string().min(3, { message: 'Campo obrigatório' }),
  password: z
    .string()
    .min(4, { message: 'Senha inválida' })
    .refine(
      (value) => {
        const pwdRagex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        return pwdRagex.test(value)
      },
      { message: 'Senha inválida' }
    ),
})

type UserFormData = z.infer<typeof userFormSchema>

export function SignupForm() {
  const { toast } = useToast()
  const { mutate: signup, isPending: isLoading, isError } = useSignup()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { fullname: '', email: '', password: '' },
  })

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    signup(data)
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !isError) {
      form.reset({
        fullname: form.getValues('fullname'),
        email: '',
        password: '',
      })
    }
  }, [form.formState, form, toast, isError])

  return (
    <>
      <Form {...form}>
        <h2 className="text-2xl font-bold mb-6">Crie sua conta</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{' '}
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento (CPF/RG)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{' '}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(xx) xxxxx-xxxx" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  A senha deve conter uma letra maiúscula, uma letra minúscula,
                  um número e um caractere especial (ex: @, $, !, %, *, ? ou &)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar
          </Button>
        </form>
      </Form>
      <p className="text-center mt-5 text-neutral-600">
        Ja possui uma conta?{' '}
        <Link to="/login" className="text-neutral-800 font-bold">
          Entre aqui
        </Link>
      </p>
    </>
  )
}
