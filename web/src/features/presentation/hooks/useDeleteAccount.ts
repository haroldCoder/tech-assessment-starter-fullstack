import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogAccountRepository } from '../../infrastructure';
import { DeleteAccountUseCase } from '../../application';

const deleteAccountUseCase = new DeleteAccountUseCase(catalogAccountRepository);

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deleteAccountUseCase.execute(code),
    onSuccess: () => {
      // Invalida la caché del árbol tras la eliminación exitosa
      queryClient.invalidateQueries({ queryKey: ['catalog-tree'] });
    },
  });
}
