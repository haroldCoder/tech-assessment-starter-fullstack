import { Module } from '@nestjs/common';
import { CatalogController } from './presentation/controllers/catalog.controller.js';
import {
  CreateAccountUseCase,
  DeleteAccountUseCase,
  FindAllAccountsUseCase,
} from './application/use-cases/index.js';
import {
  CATALOG_ACCOUNT_REPOSITORY,
  CatalogAccountRepository,
} from './domain/repositories/index.js';
import { CatalogAccountRepositoryImpl } from './infrastructure/persistance/catalog-account.repository.impl.js';

@Module({
  controllers: [CatalogController],
  providers: [
    // Registro del repositorio mediante token e implementación (useClass)
    {
      provide: CATALOG_ACCOUNT_REPOSITORY,
      useClass: CatalogAccountRepositoryImpl,
    },
    // Casos de uso provistos mediante fábricas/providers (useFactory) o instanciación directa
    {
      provide: CreateAccountUseCase,
      useFactory: (repo: CatalogAccountRepository) =>
        new CreateAccountUseCase(repo),
      inject: [CATALOG_ACCOUNT_REPOSITORY],
    },
    {
      provide: FindAllAccountsUseCase,
      useFactory: (repo: CatalogAccountRepository) =>
        new FindAllAccountsUseCase(repo),
      inject: [CATALOG_ACCOUNT_REPOSITORY],
    },
    {
      provide: DeleteAccountUseCase,
      useFactory: (repo: CatalogAccountRepository) =>
        new DeleteAccountUseCase(repo),
      inject: [CATALOG_ACCOUNT_REPOSITORY],
    },
  ],
  exports: [
    CATALOG_ACCOUNT_REPOSITORY,
    CreateAccountUseCase,
    FindAllAccountsUseCase,
    DeleteAccountUseCase,
  ],
})
export class CatalogModule {}
