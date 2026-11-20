export type AccountLevel = 'CLASS' | 'GROUP' | 'ACCOUNT' | 'SUBACCOUNT';
export type AccountNature = 'DEBIT' | 'CREDIT';

export interface AccountTreeNode {
  code: string;
  name: string;
  level: AccountLevel;
  nature: AccountNature;
  parentCode: string | null;
  allowsMovements: boolean;
  children: AccountTreeNode[];
}

export interface CreateAccountCommand {
  code: string;
  name: string;
  nature?: AccountNature;
}
