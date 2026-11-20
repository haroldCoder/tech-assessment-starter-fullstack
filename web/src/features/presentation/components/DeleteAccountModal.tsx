import { useState } from 'react';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import type { AccountTreeNode } from '../../domain';

interface DeleteAccountModalProps {
  node: AccountTreeNode | null;
  onClose: () => void;
}

export function DeleteAccountModal({ node, onClose }: DeleteAccountModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;

  const handleConfirmDelete = () => {
    setErrorMsg(null);
    deleteAccount(node.code, {
      onSuccess: () => {
        setErrorMsg(null);
        onClose();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('Error al eliminar la cuenta.');
        }
      },
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Eliminar Cuenta Contable</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div className="status-box error-box modal-error">
              {errorMsg}
            </div>
          )}

          <p>
            ¿Estás seguro de que deseas eliminar la cuenta{' '}
            <strong>
              {node.code} - {node.name}
            </strong>
            ?
          </p>

          {hasChildren && (
            <div className="status-box warning-box">
              ⚠️ <strong>Regla de negocio:</strong> Esta cuenta posee {node.children.length} cuenta(s) hija(s). La política del catálogo no permite eliminar cuentas que tengan descendientes directos.
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={isPending || hasChildren}
            >
              {isPending ? 'Eliminando...' : 'Confirmar Eliminación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
