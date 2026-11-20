import { CatalogAccountRepository } from "../../domain/repositories/index.js";

export class DeleteAccountUseCase {
    constructor(private readonly catalogAccount: CatalogAccountRepository) { }

    execute(id: string) {
        const deletedAccount = this.catalogAccount.deleteAccount(id);
        return deletedAccount;
    }
}