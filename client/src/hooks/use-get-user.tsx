import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getUser() {
  const { data } = await privateRequest.get(`users/getUser`)
  return data
}

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    // staleTime: 3000,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  })
}
