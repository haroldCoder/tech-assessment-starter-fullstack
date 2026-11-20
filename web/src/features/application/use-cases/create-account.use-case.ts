import type {
  CatalogAccountRepository,
  CreateAccountCommand,
} from '../../domain';

export class CreateAccountUseCase {
  private readonly repository: CatalogAccountRepository;

  constructor(repository: CatalogAccountRepository) {
    this.repository = repository;
  }

  execute(command: CreateAccountCommand): Promise<{ message: string; code: string }> {
    return this.repository.createAccount(command);
  }
}
