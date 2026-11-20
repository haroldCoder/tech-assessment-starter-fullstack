import { AccountNature } from '../../domain/entities/index.js';

// plus: organizarlo con class validator
export class CreateAccountDto {
  code: string;
  name: string;
  nature: AccountNature;
}
