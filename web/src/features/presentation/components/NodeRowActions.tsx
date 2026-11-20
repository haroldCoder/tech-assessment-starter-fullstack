import type { AccountTreeNode } from '../../domain';

interface NodeRowActionsProps {
  node: AccountTreeNode;
  onAddChild?: (parentCode: string) => void;
  onDeleteNode?: (node: AccountTreeNode) => void;
}

export function NodeRowActions({ node, onAddChild, onDeleteNode }: NodeRowActionsProps) {
  const isLeaf = node.allowsMovements;
  const canHaveChildren = node.code.length < 6;

  return (
    <div className="row-actions" onClick={(e) => e.stopPropagation()}>
      {canHaveChildren && (
        <button
          type="button"
          className="action-btn btn-add-child"
          title={`Crear cuenta hija bajo el código ${node.code}`}
          onClick={() => onAddChild?.(node.code)}
        >
          <span className="action-btn-icon">+</span>
          <span className="action-btn-text">Nueva Hija</span>
        </button>
      )}

      <button
        type="button"
        className={`action-btn btn-delete-node ${!isLeaf ? 'disabled-action' : ''}`}
        title={
          isLeaf
            ? `Eliminar cuenta ${node.code}`
            : 'No se puede eliminar: tiene cuentas hijas'
        }
        onClick={() => onDeleteNode?.(node)}
      >
        <span className="action-btn-icon">🗑</span>
        <span className="action-btn-text">Eliminar</span>
      </button>
    </div>
  );
}
