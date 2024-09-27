import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
import { useToast } from '../components/ui/use-toast'

// Atualizar status usando um objeto como parâmetro
const updateBooking = async ({ id }: { id: string }) => {
  const response = await privateRequest.put(`/booking/update/${id}`)
  return response.data
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Status atualizado!',
        description: 'O status foi atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user-bookings'] })
    },
  })
}
