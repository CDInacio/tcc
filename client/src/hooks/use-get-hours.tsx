import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
import { Schedule } from '../types/Slot.typep'

async function getAvaliableDates(): Promise<Schedule[]> {
  const response = await privateRequest.get('/users/avaliable-dates')
  return response.data
}

export function useGetAvaliableDates() {
  return useQuery({
    queryKey: ['avaliableTimes'],
    queryFn: getAvaliableDates,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  })
}
