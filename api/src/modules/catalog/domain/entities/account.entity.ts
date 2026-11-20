import { AccountCode } from './account-code.vo.js';
import { AccountLevel } from './account-level.enum.js';
import { AccountNature } from './account-nature.enum.js';
import {
  InvalidAccountNameError,
  InvalidParentAccountError,
} from '../errors/catalog-domain.error.js';

export interface CreateClassProps {
  code: string;
  name: string;
  nature: AccountNature;
}

export interface CreateChildProps {
  code: string;
  name: string;
}

export interface AccountProps {
  code: string;
  name: string;
  nature: AccountNature;
}

export class Account {
  private readonly _code: AccountCode;
  private readonly _name: string;
  private readonly _nature: AccountNature;

  private constructor(code: AccountCode, name: string, nature: AccountNature) {
    this._code = code;
    this._name = Account.validateName(name);
    this._nature = nature;
  }

  private static validateName(rawName: string): string {
    const trimmed = rawName ? rawName.trim() : '';
    if (!trimmed) {
      throw new InvalidAccountNameError();
    }
    return trimmed;
  }

  /**
   * Crea una cuenta raíz de nivel Clase (1 dígito) asignándole su naturaleza.
   */
  static createClass(props: CreateClassProps): Account {
    const codeVO = AccountCode.create(props.code);
    if (!codeVO.isClass()) {
      throw new InvalidParentAccountError(
        codeVO.value,
        codeVO.parentCode,
        'ninguno (las clases son de 1 dígito)',
      );
    }
    return new Account(codeVO, props.name, props.nature);
  }

  /**
   * Crea una cuenta hija (Grupo, Cuenta o Subcuenta), validando el prefijo
   * y heredando automáticamente la naturaleza de su padre.
   */
  static createChild(props: CreateChildProps, parent: Account): Account {
    const codeVO = AccountCode.create(props.code);

    if (codeVO.parentCode !== parent.code) {
      throw new InvalidParentAccountError(
        codeVO.value,
        codeVO.parentCode,
        parent.code,
      );
    }

    return new Account(codeVO, props.name, parent.nature);
  }

  /**
   * Reconstruye una entidad desde la base de datos o almacenamiento.
   */
  static reconstitute(props: AccountProps): Account {
    const codeVO = AccountCode.create(props.code);
    return new Account(codeVO, props.name, props.nature);
  }

  get code(): string {
    return this._code.value;
  }

  get codeVO(): AccountCode {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get level(): AccountLevel {
    return this._code.level;
  }

  get nature(): AccountNature {
    return this._nature;
  }

  get parentCode(): string | null {
    return this._code.parentCode;
  }

  get classCode(): string {
    return this._code.classCode;
  }

  isClass(): boolean {
    return this._code.isClass();
  }

  isDirectParentOf(child: Account | string): boolean {
    const childCode = typeof child === 'string' ? child : child.code;
    return this._code.isDirectParentOf(childCode);
  }
}
