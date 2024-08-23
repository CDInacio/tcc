import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getNotifications() {
  const { data } = await privateRequest.get(`/notifications/getNotifications/`)
  return data
}

export function useGetNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
    refetchInterval: 3000,
  })
}
