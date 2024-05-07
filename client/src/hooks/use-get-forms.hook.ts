import { getForms } from '@/api/form'
import { useQuery } from '@tanstack/react-query'

export function useGetForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: getForms,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  })
}
