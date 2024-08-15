import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getBooking({ queryKey }: { queryKey: any }) {
  const id = queryKey[1]
  if (!id) return
  const { data } = await privateRequest.get(
    `/booking/forms/getBookingById/${id}`
  )
  return data
}

export function useGetBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: getBooking,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  })
}
