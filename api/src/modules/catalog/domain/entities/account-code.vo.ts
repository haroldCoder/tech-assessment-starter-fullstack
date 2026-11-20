import {
  ACCOUNT_LEVEL_BY_LENGTH,
  AccountLevel,
  PARENT_CODE_LENGTH_BY_LENGTH,
} from './account-level.enum.js';
import { InvalidAccountCodeError } from '../errors/catalog-domain.error.js';

const NUMERIC_ONLY_REGEX = /^\d+$/;

export class AccountCode {
  readonly value: string;
  readonly level: AccountLevel;
  readonly parentCode: string | null;
  readonly classCode: string;

  private constructor(value: string, level: AccountLevel, parentCode: string | null) {
    this.value = value;
    this.level = level;
    this.parentCode = parentCode;
    this.classCode = value.slice(0, 1);
  }

  static create(rawCode: string): AccountCode {
    const trimmed = rawCode ? rawCode.trim() : '';

    if (!trimmed) {
      throw new InvalidAccountCodeError(rawCode, 'el código no puede estar vacío.');
    }

    if (!NUMERIC_ONLY_REGEX.test(trimmed)) {
      throw new InvalidAccountCodeError(
        rawCode,
        'el código debe ser exclusivamente numérico.',
      );
    }

    const level = ACCOUNT_LEVEL_BY_LENGTH[trimmed.length];
    if (!level) {
      throw new InvalidAccountCodeError(
        rawCode,
        `longitud inválida (${trimmed.length}). Debe tener 1 (Clase), 2 (Grupo), 4 (Cuenta) o 6 dígitos (Subcuenta).`,
      );
    }

    const parentLength = PARENT_CODE_LENGTH_BY_LENGTH[trimmed.length];
    const parentCode = parentLength !== null ? trimmed.slice(0, parentLength) : null;

    return new AccountCode(trimmed, level, parentCode);
  }

  isClass(): boolean {
    return this.level === AccountLevel.CLASS;
  }

  isDirectChildOf(parentCandidate: AccountCode | string): boolean {
    const parentCode =
      typeof parentCandidate === 'string'
        ? parentCandidate
        : parentCandidate.value;
    return this.parentCode === parentCode;
  }

  isDirectParentOf(childCandidate: AccountCode | string): boolean {
    const child =
      typeof childCandidate === 'string'
        ? AccountCode.create(childCandidate)
        : childCandidate;
    return child.parentCode === this.value;
  }

  isDescendantOf(ancestorCandidate: AccountCode | string): boolean {
    const ancestorCode =
      typeof ancestorCandidate === 'string'
        ? ancestorCandidate
        : ancestorCandidate.value;
    return this.value.length > ancestorCode.length && this.value.startsWith(ancestorCode);
  }

  equals(other: AccountCode | string): boolean {
    const otherCode = typeof other === 'string' ? other : other.value;
    return this.value === otherCode;
  }

  toString(): string {
    return this.value;
  }
}
