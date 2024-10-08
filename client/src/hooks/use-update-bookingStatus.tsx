import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
import { useToast } from '../components/ui/use-toast'

// Atualizar status usando um objeto como parâmetro
const updateBookingStatus = async ({
  id,
  status,
  userId,
  role,
  date,
  time,
}: {
  id: string
  status: string
  userId: string
  role: string
  date: string
  time: string
}) => {
  console.log('first')
  const response = await privateRequest.put(`/booking/updateStatus/${id}`, {
    status,
    userId,
    role,
    date,
    time,
  })
  return response.data
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: updateBookingStatus,
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
