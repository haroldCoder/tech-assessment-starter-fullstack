export const AccountLevel = {
  CLASS: 'CLASS',
  GROUP: 'GROUP',
  ACCOUNT: 'ACCOUNT',
  SUBACCOUNT: 'SUBACCOUNT',
} as const;

export type AccountLevel = (typeof AccountLevel)[keyof typeof AccountLevel];

export const ACCOUNT_LEVEL_BY_LENGTH: Readonly<Record<number, AccountLevel>> = {
  1: AccountLevel.CLASS,
  2: AccountLevel.GROUP,
  4: AccountLevel.ACCOUNT,
  6: AccountLevel.SUBACCOUNT,
};

export const PARENT_CODE_LENGTH_BY_LENGTH: Readonly<Record<number, number | null>> = {
  1: null,
  2: 1,
  4: 2,
  6: 4,
};

export const VALID_ACCOUNT_CODE_LENGTHS = [1, 2, 4, 6] as const;
