import type { AccountTreeNode } from '../../domain';

interface NodeDetailPanelProps {
  node: AccountTreeNode | null;
  onClose: () => void;
  onAddChild: (parentCode: string) => void;
  onDeleteNode: (node: AccountTreeNode) => void;
}

export function NodeDetailPanel({
  node,
  onClose,
  onAddChild,
  onDeleteNode,
}: NodeDetailPanelProps) {
  if (!node) return null;

  const canHaveChildren = node.code.length < 6;

  return (
    <aside className="selected-node-panel">
      <div className="selected-node-header">
        <h4>Detalle de la Cuenta</h4>
        <div className="selected-node-actions">
          {canHaveChildren && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onAddChild(node.code)}
            >
              + Agregar Hija
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onDeleteNode(node)}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="node-detail-grid">
        <div>
          <strong>Código:</strong> {node.code}
        </div>
        <div>
          <strong>Nombre:</strong> {node.name}
        </div>
        <div>
          <strong>Nivel:</strong> {node.level}
        </div>
        <div>
          <strong>Naturaleza:</strong> {node.nature === 'DEBIT' ? 'Débito' : 'Crédito'}
        </div>
        <div>
          <strong>Padre:</strong> {node.parentCode || 'Ninguno (Clase Raíz)'}
        </div>
        <div>
          <strong>Admite movimientos:</strong>{' '}
          {node.allowsMovements ? 'Sí (Cuenta Hoja)' : 'No (Cuenta Agrupadora)'}
        </div>
      </div>

      <button type="button" className="btn-close-detail" onClick={onClose}>
        Cerrar detalle
      </button>
    </aside>
  );
}
