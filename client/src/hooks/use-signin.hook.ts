import { signin } from '@/api/user'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useSignin() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      if (data) {
        if (data.user.role === 'USER') {
          navigate('/perfil')
        } else {
          navigate('/')
        }
        localStorage.setItem('userToken', data.token as string)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao autenticar!',
        description: error.message,
      })
    },
  })
}
