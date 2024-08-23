import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function readNotification() {
  await privateRequest.put('/notifications/markAsRead')
}

export function useReadNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: readNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error)
    },
  })
}
