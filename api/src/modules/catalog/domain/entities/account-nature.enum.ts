export const AccountNature = {
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
} as const;

export type AccountNature = (typeof AccountNature)[keyof typeof AccountNature];
