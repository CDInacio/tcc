import { useQuery } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'

async function getForm({ id }: { id: string }) {
  const response = await privateRequest.get(`/users/getForm/${id}`)
  return response.data
}

export function useGetForm(id: string) {
  return useQuery({
    queryKey: ['forms', id],
    queryFn: () => getForm({ id }),
    staleTime: 300,
    refetchOnWindowFocus: false,
  })
}
