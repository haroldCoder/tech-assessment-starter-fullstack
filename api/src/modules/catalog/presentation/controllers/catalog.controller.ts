import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  CreateAccountUseCase,
  DeleteAccountUseCase,
  FindAllAccountsUseCase,
} from '../../application/use-cases/index.js';
import { CreateAccountDto } from '../dtos/index.js';
import { CatalogDomainExceptionFilter } from '../filters/index.js';

@Controller('catalog/accounts')
@UseFilters(CatalogDomainExceptionFilter)
export class CatalogController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly findAllAccountsUseCase: FindAllAccountsUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findAllAccountsUseCase.execute();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAccountDto) {
    const code = this.createAccountUseCase.execute(dto);
    return {
      message: 'Cuenta creada exitosamente',
      code,
    };
  }

  @Delete(':code')
  @HttpCode(HttpStatus.OK)
  delete(@Param('code') code: string) {
    const deletedCode = this.deleteAccountUseCase.execute(code);
    return {
      message: 'Cuenta eliminada exitosamente',
      code: deletedCode,
    };
  }
}
