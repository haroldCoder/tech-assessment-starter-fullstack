import { AccountLevel } from "../entities/account-level.enum.js";
import { AccountNature } from "../entities/account-nature.enum.js";
import { Account, CreateClassProps } from "../entities/account.entity.js";

export interface CatalogAccountRepository {
  createAccount(account: CreateClassProps): string;
  findAllCatalog(): Array<Account>; // devolver como un arbol
  deleteAccount(code: string): string;
}

export const CATALOG_ACCOUNT_REPOSITORY = Symbol('CatalogAccountRepository');

export interface AccountTreeNode {
  code: string;
  name: string;
  level: AccountLevel;
  nature: AccountNature;
  parentCode: string | null;
  allowsMovements: boolean;
  children: AccountTreeNode[];
}

