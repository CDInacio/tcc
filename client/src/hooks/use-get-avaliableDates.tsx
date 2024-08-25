import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getAvaliableDates() {
  const response = await privateRequest.get('/users/avaliableDates')
  // console.log(response.data)
  return response.data
}

export function useGetAvaliableDates() {
  return useQuery({
    queryKey: ['avaliable-dates'],
    queryFn: getAvaliableDates,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  })
}
