import { useMutation, useQueryClient } from '@tanstack/react-query'
import { privateRequest } from '../utils/api'
import { useToast } from '../components/ui/use-toast'

// Função para atualizar o usuário
const updateUser = async ({
  id,
  data,
}: {
  id: string | undefined
  data: unknown
}) => {
  console.log('Dados para atualização:', data)
  const response = await privateRequest.put(`users/updateUser/${id}`, data)
  return response.data
}

// Hook customizado que utiliza o react-query
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: 'Nível de acesso atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] }) // Invalidando o cache de usuários após a atualização
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status do usuário',
      })
    },
  })
}
