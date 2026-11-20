import { Account } from "../../domain/index.js";
import { CatalogAccountRepository } from "../../domain/repositories/index.js";

export class CreateAccountUseCase {
    constructor(private readonly catalogAccount: CatalogAccountRepository) { }

    execute(account: Account) {
        const code = this.catalogAccount.createAccount(account);
        return code;
    }
}