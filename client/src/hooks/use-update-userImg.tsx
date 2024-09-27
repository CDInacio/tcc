import { useMutation } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
// import { useToast } from '../components/ui/use-toast'

const updateUserImg = async ({
  id,
  data,
}: {
  id: string | undefined
  data: any
}) => {
  const response = await privateRequest.put(`users/updateUserImg/${id}`, data)
  return response.data
}

export function useUpdateUserImg() {
  // const queryClient = useQueryClient()
  // const { toast } = useToast()
  return useMutation({
    mutationFn: updateUserImg,
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
