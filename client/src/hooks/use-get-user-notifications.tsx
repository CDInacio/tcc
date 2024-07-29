import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getUserNotifications() {
  const { data } = await privateRequest.get(
    '/booking/forms/getuserNotifications'
  )
  return data
}

export function useGetUserNotifications() {
  return useQuery({
    queryKey: ['user-notifications'],
    queryFn: getUserNotifications,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  })
}
