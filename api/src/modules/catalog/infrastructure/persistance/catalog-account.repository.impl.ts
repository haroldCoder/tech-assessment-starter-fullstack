import {
    Account,
    AccountCreationPolicy,
    AccountDeletionPolicy,
    CreateClassProps,
} from '../../domain/index.js';
import { CatalogAccountRepository } from '../../domain/repositories/index.js';
import { CatalogDomainError } from '../../domain/errors/index.js';
import { createInitialSeedAccounts } from './catalog-seed.data.js';

export class CatalogAccountNotFoundError extends CatalogDomainError {
    constructor(accountCode: string) {
        super(
            'ACCOUNT_NOT_FOUND',
            `La cuenta con código "${accountCode}" no fue encontrada en el catálogo.`,
        );
    }
}

export class CatalogAccountRepositoryImpl implements CatalogAccountRepository {
    private readonly accounts: Account[] = [];

    constructor(initialAccounts: Account[] = createInitialSeedAccounts()) { // aqui vamos a ponerle datos de prueba por ahora
        this.accounts = [...initialAccounts];
    }

    /**
     * Crea una nueva cuenta aplicando la validación de unicidad, existencia
     * del padre y herencia de naturaleza mediante AccountCreationPolicy.
     */
    createAccount(account: CreateClassProps): string {
        const validatedAccount = AccountCreationPolicy.validateAndCreate(
            {
                code: account.code,
                name: account.name,
                nature: account.nature,
            },
            this.accounts,
        );

        this.accounts.push(validatedAccount);
        return validatedAccount.code;
    }

    /**
     * Retorna todas las cuentas del catálogo ordenadas jerárquicamente por código.
     */
    findAllCatalog(): Array<Account> {
        return [...this.accounts].sort((a, b) => a.code.localeCompare(b.code));
    }

    /**
     * Elimina una cuenta validando con AccountDeletionPolicy que no tenga hijas.
     */
    deleteAccount(code: string): string {
        const trimmedCode = code ? code.trim() : '';
        const index = this.accounts.findIndex((acc) => acc.code === trimmedCode);

        if (index === -1) {
            throw new CatalogAccountNotFoundError(trimmedCode);
        }

        AccountDeletionPolicy.validateDeletion(trimmedCode, this.accounts);

        const [deletedAccount] = this.accounts.splice(index, 1);
        return deletedAccount.code;
    }
}