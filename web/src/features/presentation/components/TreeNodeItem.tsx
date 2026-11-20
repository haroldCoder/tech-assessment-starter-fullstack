import type { AccountTreeNode } from '../../domain';

interface TreeNodeItemProps {
  node: AccountTreeNode;
  isExpanded: boolean;
  onToggleExpand: (code: string) => void;
  isNodeExpanded: (code: string) => boolean;
  onSelectNode?: (node: AccountTreeNode) => void;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  CLASS: { label: 'Clase (1 dígito)', color: '#1e40af', bg: '#dbeafe' },
  GROUP: { label: 'Grupo (2 dígitos)', color: '#0369a1', bg: '#e0f2fe' },
  ACCOUNT: { label: 'Cuenta (4 dígitos)', color: '#4338ca', bg: '#ede9fe' },
  SUBACCOUNT: { label: 'Subcuenta (6 dígitos)', color: '#374151', bg: '#f3f4f6' },
};

export function TreeNodeItem({
  node,
  isExpanded,
  onToggleExpand,
  isNodeExpanded,
  onSelectNode,
}: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0;

  const levelInfo = LEVEL_CONFIG[node.level] || {
    label: node.level,
    color: '#374151',
    bg: '#f3f4f6',
  };

  return (
    <li className="tree-node-item">
      <div
        className="tree-node-row"
        onClick={() => {
          onSelectNode?.(node);
          if (hasChildren) {
            onToggleExpand(node.code);
          }
        }}
      >
        {/* Botón de expandir / colapsar */}
        <button
          type="button"
          className="toggle-button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) {
              onToggleExpand(node.code);
            }
          }}
          disabled={!hasChildren}
          aria-label={hasChildren ? (isExpanded ? 'Colapsar' : 'Expandir') : 'Hoja'}
        >
          {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
        </button>

        {/* Código de cuenta */}
        <span className="account-code">{node.code}</span>

        {/* Nombre de cuenta */}
        <span className="account-name">{node.name}</span>

        {/* Badge Nivel */}
        <span
          className="badge-level"
          style={{ color: levelInfo.color, backgroundColor: levelInfo.bg }}
        >
          {levelInfo.label}
        </span>

        {/* Badge Naturaleza */}
        <span className={`badge-nature ${node.nature === 'DEBIT' ? 'nature-debit' : 'nature-credit'}`}>
          {node.nature === 'DEBIT' ? 'Débito' : 'Crédito'}
        </span>

        {/* Indicador de movimiento */}
        {node.allowsMovements ? (
          <span className="badge-movement movement-allowed" title="No tiene hijas: admite asientos directos">
            ✓ Movimiento
          </span>
        ) : (
          <span className="badge-movement movement-blocked" title="Tiene cuentas hijas: cuenta agrupadora">
            Agrupadora
          </span>
        )}
      </div>

      {/* Renderizado recursivo de hijos */}
      {hasChildren && isExpanded && (
        <ul className="tree-children-list">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.code}
              node={child}
              isExpanded={isNodeExpanded(child.code)}
              onToggleExpand={onToggleExpand}
              isNodeExpanded={isNodeExpanded}
              onSelectNode={onSelectNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
