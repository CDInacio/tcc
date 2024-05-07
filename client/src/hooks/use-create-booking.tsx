import { createBooking } from '@/api/booking'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'

export function useCreateBooking() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Agendamento realizado com sucesso!',
        description: 'Seu agendamento foi realizado com sucesso!',
      })
    },
  })
}
