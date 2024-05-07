import { getAllUsers } from '@/api/user'
import { useQuery } from '@tanstack/react-query'

export function useGetAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  })
}
