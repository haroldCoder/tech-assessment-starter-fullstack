import { apiUrl } from '../../../api';
import type {
  AccountTreeNode,
  CatalogAccountRepository,
  CreateAccountCommand,
} from '../../domain';

export class CatalogAccountHttpRepository implements CatalogAccountRepository {
  async getCatalogTree(): Promise<AccountTreeNode[]> {
    const response = await fetch(apiUrl('/catalog/accounts'));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener catálogo (HTTP ${response.status})`);
    }
    return response.json();
  }

  async createAccount(command: CreateAccountCommand): Promise<{ message: string; code: string }> {
    const response = await fetch(apiUrl('/catalog/accounts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear cuenta (HTTP ${response.status})`);
    }
    return response.json();
  }

  async deleteAccount(code: string): Promise<{ message: string; code: string }> {
    const response = await fetch(apiUrl(`/catalog/accounts/${code}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al eliminar cuenta (HTTP ${response.status})`);
    }
    return response.json();
  }
}

export const catalogAccountRepository = new CatalogAccountHttpRepository();
