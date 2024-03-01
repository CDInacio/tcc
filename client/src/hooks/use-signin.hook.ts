import { signin } from '@/api/user'
import { useToast } from '@/components/ui/use-toast'
import { isAxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

export function useSignin() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation(signin, {
    onSuccess: (data) => {
      navigate('/')
      localStorage.setItem('userToken', data.token as string)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast({
          variant: 'destructive',
          title: 'Erro ao autenticar!',
          description: error.response.data.message,
        })
      }
    },
  })
}
