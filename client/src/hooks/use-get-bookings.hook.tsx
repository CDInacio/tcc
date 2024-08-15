import { getBookings } from '@/api/booking'
import { useQuery } from '@tanstack/react-query'

export function useGetBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  })
}
