import { getForms } from '@/api/form'
import { useQuery } from 'react-query'

export const useGetForms = () => {
  return useQuery('form', getForms, {
    refetchOnWindowFocus: false,
  })
}
