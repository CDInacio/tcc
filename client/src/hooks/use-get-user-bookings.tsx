import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getUserBookings() {
  const { data } = await privateRequest.get('/booking/user')
  return data
}

export function useGetUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: getUserBookings,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  })
}
