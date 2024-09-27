import { deleteForm } from '@/api/form'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Formulário deletado com sucesso!',
        description: 'Seu formulário foi deletado com sucesso!',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}
