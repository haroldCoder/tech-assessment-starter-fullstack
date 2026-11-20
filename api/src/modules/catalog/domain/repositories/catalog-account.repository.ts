import { Account } from "../entities/account.entity.js";

export interface CatalogAccountRepository {
  createAccount(account: Account): string;
  findAllCatalog(): Array<Account>; // devolver como un arbol
  deleteAccount(code: string): string;
}
