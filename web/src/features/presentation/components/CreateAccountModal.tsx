import { useState, useId } from 'react';
import { useCreateAccount } from '../hooks/useCreateAccount';
import type { AccountNature } from '../../domain';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultParentCode?: string | null;
}

export function CreateAccountModal({ isOpen, onClose, defaultParentCode }: CreateAccountModalProps) {
  const [code, setCode] = useState(defaultParentCode || '');
  const [name, setName] = useState('');
  const [nature, setNature] = useState<AccountNature>('DEBIT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const codeInputId = useId();
  const nameInputId = useId();
  const natureSelectId = useId();

  const { mutate: createAccount, isPending } = useCreateAccount();

  if (!isOpen) return null;

  const isClassLevel = code.trim().length === 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedCode = code.trim();
    const trimmedName = name.trim();

    if (!trimmedCode) {
      setErrorMsg('El código de cuenta es requerido.');
      return;
    }

    if (!trimmedName) {
      setErrorMsg('El nombre de la cuenta es requerido.');
      return;
    }

    createAccount(
      {
        code: trimmedCode,
        name: trimmedName,
        nature: isClassLevel ? nature : undefined,
      },
      {
        onSuccess: () => {
          setCode('');
          setName('');
          setErrorMsg(null);
          onClose();
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            setErrorMsg(err.message);
          } else {
            setErrorMsg('Ocurrió un error inesperado al crear la cuenta.');
          }
        },
      },
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Crear Nueva Cuenta Contable</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errorMsg && (
            <div className="status-box error-box modal-error">
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor={codeInputId}>Código Numérico:</label>
            <input
              id={codeInputId}
              type="text"
              className="form-control"
              placeholder="Ej: 1, 11, 1105, 110505"
              value={code}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, '');
                setCode(numericOnly);
              }}
              disabled={isPending}
              autoFocus
            />
            <small className="form-help">
              Longitudes válidas: 1 (Clase), 2 (Grupo), 4 (Cuenta) o 6 dígitos (Subcuenta).
            </small>
          </div>

          <div className="form-group">
            <label htmlFor={nameInputId}>Nombre de la Cuenta:</label>
            <input
              id={nameInputId}
              type="text"
              className="form-control"
              placeholder="Ej: Caja Menor Oficina Central"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* La naturaleza solo se define manualmente para Clases (1 dígito); los hijos la heredan */}
          {isClassLevel && (
            <div className="form-group">
              <label htmlFor={natureSelectId}>Naturaleza de la Clase:</label>
              <select
                id={natureSelectId}
                className="form-control"
                value={nature}
                onChange={(e) => setNature(e.target.value as AccountNature)}
                disabled={isPending}
              >
                <option value="DEBIT">Débito</option>
                <option value="CREDIT">Crédito</option>
              </select>
              <small className="form-help">
                Todos los grupos, cuentas y subcuentas descendientes heredarán esta naturaleza.
              </small>
            </div>
          )}

          {!isClassLevel && code.trim().length > 1 && (
            <div className="info-banner">
              ℹ️ Esta cuenta heredará automáticamente la naturaleza contable de su cuenta padre.
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
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Guardando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
