import { useQuery } from '@tanstack/react-query';
import { catalogAccountRepository } from '../../infrastructure';
import { GetCatalogTreeUseCase } from '../../application';
import type { AccountTreeNode } from '../../domain';

const getCatalogTreeUseCase = new GetCatalogTreeUseCase(catalogAccountRepository);

export function useCatalogTree() {
  return useQuery<AccountTreeNode[]>({
    queryKey: ['catalog-tree'],
    queryFn: () => getCatalogTreeUseCase.execute(),
  });
}
