import type { AccountTreeNode, CatalogAccountRepository } from '../../domain';

export class GetCatalogTreeUseCase {
  private readonly repository: CatalogAccountRepository;

  constructor(repository: CatalogAccountRepository) {
    this.repository = repository;
  }

  execute(): Promise<AccountTreeNode[]> {
    return this.repository.getCatalogTree();
  }
}
