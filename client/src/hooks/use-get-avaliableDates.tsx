import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getAvaliableDates() {
  try {
    const response = await privateRequest.get('/users/avaliableDates')
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export function useGetAvaliableDates() {
  return useQuery({
    queryKey: ['avaliable-dates'],
    queryFn: getAvaliableDates,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  })
}
