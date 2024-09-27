import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

const deleteUser = async (id: string) => {
  const response = await privateRequest.delete(`/users/deleteUser/${id}`)
  console.log(response.data)
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Usuário foi deletado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
