import { Account } from "../entities/account.entity.js";

export interface CatalogAccountRepository {
    createAccout(account: Account): string;
    findAllCatalog(): Array<Account>; // devolver como un arbol
    deleteAccount(code: string): string;
}