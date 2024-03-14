import { createForm } from '@/api/form'
import { useMutation } from 'react-query'
import { useToast } from '@/components/ui/use-toast'

export const useCreateForm = () => {
  const { toast } = useToast()
  return useMutation(createForm, {
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Formulário criado com sucesso.',
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
