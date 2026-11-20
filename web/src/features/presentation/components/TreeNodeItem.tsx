import { NodeBadges } from './NodeBadges';
import { NodeRowActions } from './NodeRowActions';
import type { AccountTreeNode } from '../../domain';

interface TreeNodeItemProps {
  node: AccountTreeNode;
  isExpanded: boolean;
  onToggleExpand: (code: string) => void;
  isNodeExpanded: (code: string) => boolean;
  onSelectNode?: (node: AccountTreeNode) => void;
  onAddChild?: (parentCode: string) => void;
  onDeleteNode?: (node: AccountTreeNode) => void;
}

export function TreeNodeItem({
  node,
  isExpanded,
  onToggleExpand,
  isNodeExpanded,
  onSelectNode,
  onAddChild,
  onDeleteNode,
}: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0;

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

        {/* Código y Nombre */}
        <span className="account-code">{node.code}</span>
        <span className="account-name">{node.name}</span>

        {/* Badges de metadata contable */}
        <NodeBadges
          level={node.level}
          nature={node.nature}
          allowsMovements={node.allowsMovements}
        />

        {/* Acciones por fila */}
        <NodeRowActions
          node={node}
          onAddChild={onAddChild}
          onDeleteNode={onDeleteNode}
        />
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
              onAddChild={onAddChild}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
