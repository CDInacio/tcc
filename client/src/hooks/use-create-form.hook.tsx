import { createForm } from '@/api/form'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'

export function useCreateForm() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Formulário criado com sucesso!',
        description: 'Seu formulário foi criado com sucesso!',
      })
    },
  })
}
