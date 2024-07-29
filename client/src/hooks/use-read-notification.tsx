// import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function readNotification(id?: string) {
  console.log('ola')
  const { data } = await privateRequest.put('/booking/notifications/markAsRead')
  console.log(data)
}

export function useReadNotification() {
  const queryClient = useQueryClient()
  // const { toast } = useToast()
  return useMutation({
    mutationFn: readNotification,
    // onSuccess: () => {
    //   toast({
    //     variant: 'success',
    //     title: 'Formulário criado com sucesso!',
    //     description: 'Seu formulário foi criado com sucesso!',
    //   })
    // },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] })
    },
  })
}
