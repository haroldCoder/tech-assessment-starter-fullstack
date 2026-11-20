import {
  Account,
  AccountMovementPolicy,
} from '../../domain/index.js';
import {
  AccountTreeNode,
  CatalogAccountRepository,
} from '../../domain/repositories/index.js';

export class FindAllAccountsUseCase {
  constructor(
    private readonly catalogAccountRepository: CatalogAccountRepository,
  ) {}

  execute(): AccountTreeNode[] {
    const flatAccounts: Account[] =
      this.catalogAccountRepository.findAllCatalog();
    return this.buildTree(flatAccounts);
  }

  private buildTree(accounts: Account[]): AccountTreeNode[] {
    const nodeMap = new Map<string, AccountTreeNode>();

    for (const acc of accounts) {
      const allowsMovements = AccountMovementPolicy.allowsMovements(
        acc.code,
        accounts,
      );

      nodeMap.set(acc.code, {
        code: acc.code,
        name: acc.name,
        level: acc.level,
        nature: acc.nature,
        parentCode: acc.parentCode,
        allowsMovements,
        children: [],
      });
    }

    const roots: AccountTreeNode[] = [];

    for (const acc of accounts) {
      const node = nodeMap.get(acc.code)!;
      if (acc.parentCode && nodeMap.has(acc.parentCode)) {
        nodeMap.get(acc.parentCode)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}

// Alias de retrocompatibilidad
export { FindAllAccountsUseCase as FIndAllAccountsUseCase };
