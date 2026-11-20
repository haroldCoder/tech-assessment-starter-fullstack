export class CatalogDomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class InvalidAccountCodeError extends CatalogDomainError {
  constructor(accountCode: string, reason: string) {
    super(
      'INVALID_ACCOUNT_CODE',
      `El código "${accountCode}" no es válido: ${reason}`,
    );
  }
}

export class InvalidAccountNameError extends CatalogDomainError {
  constructor() {
    super(
      'INVALID_ACCOUNT_NAME',
      'El nombre de la cuenta es obligatorio y no puede estar vacío.',
    );
  }
}

export class DuplicateAccountCodeError extends CatalogDomainError {
  constructor(accountCode: string) {
    super(
      'DUPLICATE_ACCOUNT_CODE',
      `Ya existe una cuenta con el código "${accountCode}". El código debe ser único en todo el catálogo.`,
    );
  }
}

export class ParentAccountNotFoundError extends CatalogDomainError {
  constructor(accountCode: string, expectedParentCode: string) {
    super(
      'PARENT_ACCOUNT_NOT_FOUND',
      `No se puede crear la cuenta "${accountCode}" porque su cuenta padre "${expectedParentCode}" no existe.`,
    );
  }
}

export class InvalidParentAccountError extends CatalogDomainError {
  constructor(
    accountCode: string,
    expectedParentCode: string | null,
    actualParentCode: string,
  ) {
    super(
      'INVALID_PARENT_ACCOUNT',
      `El padre de la cuenta "${accountCode}" debe ser "${expectedParentCode ?? 'ninguno'}", pero se especificó "${actualParentCode}".`,
    );
  }
}

export class MissingClassNatureError extends CatalogDomainError {
  constructor(accountCode: string) {
    super(
      'MISSING_CLASS_NATURE',
      `La cuenta clase "${accountCode}" debe tener una naturaleza definida (DEBIT o CREDIT).`,
    );
  }
}

export class AccountHasChildrenDeletionError extends CatalogDomainError {
  constructor(accountCode: string) {
    super(
      'ACCOUNT_HAS_CHILDREN_DELETION',
      `No se puede eliminar la cuenta "${accountCode}" porque tiene cuentas hijas.`,
    );
  }
}

export class AccountWithChildrenMovementError extends CatalogDomainError {
  constructor(accountCode: string) {
    super(
      'ACCOUNT_WITH_CHILDREN_MOVEMENT_NOT_ALLOWED',
      `La cuenta "${accountCode}" tiene cuentas hijas y no admite movimientos contables. Solo las cuentas sin hijas admiten movimientos.`,
    );
  }
}
