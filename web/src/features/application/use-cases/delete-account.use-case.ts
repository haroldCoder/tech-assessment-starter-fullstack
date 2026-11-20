import type { CatalogAccountRepository } from '../../domain';

export class DeleteAccountUseCase {
  private readonly repository: CatalogAccountRepository;

  constructor(repository: CatalogAccountRepository) {
    this.repository = repository;
  }

  execute(code: string): Promise<{ message: string; code: string }> {
    return this.repository.deleteAccount(code);
  }
}
