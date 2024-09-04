import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
// import { useToast } from '../components/ui/use-toast'

const updateUser = async ({
  id,
  data,
}: {
  id: string | undefined
  data: any
}) => {
  const response = await privateRequest.put(`users/updateUser/${id}`, data)
  return response.data
}

export function useUpdateUser() {
  // const queryClient = useQueryClient()
  // const { toast } = useToast()
  return useMutation({
    mutationFn: updateUser,
    // onSuccess: () => {
    //   toast({
    //     variant: 'success',
    //     title: 'Status atualizado!',
    //     description: 'O status foi atualizado com sucesso!',
    //   })
    // },
    // invalidate queris after update
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}
