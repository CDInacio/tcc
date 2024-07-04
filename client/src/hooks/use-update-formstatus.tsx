import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateRequest } from "../utils/api";
import { useToast } from "../components/ui/use-toast";

const updateFormStatus = async (id: string) => {
  const response = await privateRequest.put(`admin/forms/updateStatus/${id}`)
  return response.data
}

export function useUpdateFormStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: updateFormStatus,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Status atualizado!',
        description: 'O status foi atualizado com sucesso!',
      })
    },
    // invalidate queris after update
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  })
}