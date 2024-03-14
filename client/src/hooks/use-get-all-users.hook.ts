import { getAllUsers } from '@/api/user'
import { useQuery } from 'react-query'

export function useGetAllUsers() {
  return useQuery('getAllUsers', getAllUsers, { staleTime: 10000 }) // 10 sec
}
