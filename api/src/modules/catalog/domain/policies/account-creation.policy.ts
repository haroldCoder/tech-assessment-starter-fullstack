import { Account } from '../entities/account.entity.js';
import { AccountCode } from '../entities/account-code.vo.js';
import { AccountNature } from '../entities/account-nature.enum.js';
import {
  DuplicateAccountCodeError,
  MissingClassNatureError,
  ParentAccountNotFoundError,
} from '../errors/catalog-domain.error.js';

export interface AccountCreationCandidate {
  code: string;
  name: string;
  nature?: AccountNature;
}

export class AccountCreationPolicy {
  /**
   * Valida la creación de una cuenta en el catálogo:
   * 1. Unicidad del código.
   * 2. Si es Clase (1 dígito): no requiere padre y exige naturaleza explícita.
   * 3. Si no es Clase (2, 4, 6 dígitos): exige que el padre exista en el catálogo.
   * Retorna la nueva entidad `Account` con la naturaleza heredada si es hija.
   */
  static validateAndCreate(
    candidate: AccountCreationCandidate,
    existingAccounts: readonly Account[],
  ): Account {
    const codeVO = AccountCode.create(candidate.code);

    const isDuplicate = existingAccounts.some((acc) =>
      codeVO.equals(acc.code),
    );

    if (isDuplicate) {
      throw new DuplicateAccountCodeError(codeVO.value);
    }

    if (codeVO.isClass()) {
      if (!candidate.nature) {
        throw new MissingClassNatureError(codeVO.value);
      }
      return Account.createClass({
        code: candidate.code,
        name: candidate.name,
        nature: candidate.nature,
      });
    }

    const parentCode = codeVO.parentCode!;
    const parent = existingAccounts.find((acc) => acc.code === parentCode);

    if (!parent) {
      throw new ParentAccountNotFoundError(codeVO.value, parentCode);
    }

    return Account.createChild(
      {
        code: candidate.code,
        name: candidate.name,
      },
      parent,
    );
  }
}
