import type { AccountTreeNode, CreateAccountCommand } from '../models/account.model';

export interface CatalogAccountRepository {
  getCatalogTree(): Promise<AccountTreeNode[]>;
  createAccount(command: CreateAccountCommand): Promise<{ message: string; code: string }>;
  deleteAccount(code: string): Promise<{ message: string; code: string }>;
}
