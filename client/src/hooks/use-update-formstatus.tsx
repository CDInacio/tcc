import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
import { useToast } from '../components/ui/use-toast'

const updateFormStatus = async ({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) => {
  console.log(isActive)
  const response = await privateRequest.put(`admin/form/updateStatus/${id}`, {
    isActive,
  })
  return response.data
}

export function useUpdateFormStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: updateFormStatus,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Status atualizado!',
        description: 'O status foi atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}
