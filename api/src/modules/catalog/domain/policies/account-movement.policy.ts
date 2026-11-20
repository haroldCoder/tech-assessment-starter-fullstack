import { Account } from '../entities/account.entity.js';
import { AccountWithChildrenMovementError } from '../errors/catalog-domain.error.js';

export class AccountMovementPolicy {
  /**
   * Regla: Solo las cuentas sin hijos o hijas admiten movimientos contables (cuentas de detalle o imputables).
   */
  static allowsMovements(
    targetAccountCode: string,
    allAccounts: readonly Account[],
  ): boolean {
    const hasChildren = allAccounts.some(
      (acc) => acc.parentCode === targetAccountCode,
    );
    return !hasChildren;
  }

  static validateAllowsMovements(
    targetAccountCode: string,
    allAccounts: readonly Account[],
  ): void {
    if (!this.allowsMovements(targetAccountCode, allAccounts)) {
      throw new AccountWithChildrenMovementError(targetAccountCode);
    }
  }
}
