import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getDataOverview() {
  const { data } = await privateRequest.get('/admin/getDataOverview')
  return data
}

export function useGetDataOverview() {
  return useQuery({
    queryKey: ['bookingsOverview'],
    queryFn: getDataOverview,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  })
}
