import { Account } from '../entities/account.entity.js';
import { AccountHasChildrenDeletionError } from '../errors/catalog-domain.error.js';

export class AccountDeletionPolicy {
  /**
   * Regla: No se puede eliminar una cuenta que tenga cuentas hijas.
   */
  static hasChildren(
    targetAccountCode: string,
    allAccounts: readonly Account[],
  ): boolean {
    return allAccounts.some((acc) => acc.parentCode === targetAccountCode);
  }

  static getChildren(
    targetAccountCode: string,
    allAccounts: readonly Account[],
  ): Account[] {
    return allAccounts.filter((acc) => acc.parentCode === targetAccountCode);
  }

  static validateDeletion(
    targetAccountCode: string,
    allAccounts: readonly Account[],
  ): void {
    if (this.hasChildren(targetAccountCode, allAccounts)) {
      throw new AccountHasChildrenDeletionError(targetAccountCode);
    }
  }
}
