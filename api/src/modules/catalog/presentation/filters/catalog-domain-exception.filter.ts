import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CatalogDomainError } from '../../domain/errors/index.js';
import { CatalogAccountNotFoundError } from '../../infrastructure/persistance/catalog-account.repository.impl.js';

@Catch(CatalogDomainError)
export class CatalogDomainExceptionFilter implements ExceptionFilter {
  catch(exception: CatalogDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveHttpStatus(exception);

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      code: exception.code,
      message: exception.message,
    });
  }

  private resolveHttpStatus(exception: CatalogDomainError): HttpStatus {
    if (exception instanceof CatalogAccountNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    switch (exception.code) {
      case 'DUPLICATE_ACCOUNT_CODE':
        return HttpStatus.CONFLICT;
      case 'PARENT_ACCOUNT_NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'ACCOUNT_HAS_CHILDREN_DELETION':
      case 'ACCOUNT_WITH_CHILDREN_MOVEMENT_NOT_ALLOWED':
        return HttpStatus.BAD_REQUEST;
      case 'INVALID_ACCOUNT_CODE':
      case 'INVALID_ACCOUNT_NAME':
      case 'INVALID_PARENT_ACCOUNT':
      case 'MISSING_CLASS_NATURE':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
