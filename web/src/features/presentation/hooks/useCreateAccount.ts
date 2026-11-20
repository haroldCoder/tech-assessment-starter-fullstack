import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogAccountRepository } from '../../infrastructure';
import { CreateAccountUseCase } from '../../application';
import type { CreateAccountCommand } from '../../domain';

const createAccountUseCase = new CreateAccountUseCase(catalogAccountRepository);

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: CreateAccountCommand) => createAccountUseCase.execute(command),
    onSuccess: () => {
      // Invalida la caché del árbol para reflejar instantáneamente el nuevo nodo
      queryClient.invalidateQueries({ queryKey: ['catalog-tree'] });
    },
  });
}
