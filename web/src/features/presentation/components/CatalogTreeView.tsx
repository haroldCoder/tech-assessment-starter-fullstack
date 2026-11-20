import { useState, useMemo } from 'react';
import { useCatalogTree } from '../hooks/useCatalogTree';
import { TreeNodeItem } from './TreeNodeItem';
import type { AccountTreeNode } from '../../domain';

export function CatalogTreeView() {
  const { data: tree = [], isLoading, isError, error, refetch } = useCatalogTree();
  const [selectedNode, setSelectedNode] = useState<AccountTreeNode | null>(null);

  // Recolecta todos los códigos de nodos que tienen hijas
  const allParentCodes = useMemo(() => {
    const codes: string[] = [];
    const traverse = (nodes: AccountTreeNode[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          codes.push(node.code);
          traverse(node.children);
        }
      }
    };
    traverse(tree);
    return codes;
  }, [tree]);

  // Conjunto de códigos actualmente expandidos (por defecto todos los padres)
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(() => new Set());

  // Al cargar el árbol por primera vez, expandimos todos los padres
  const [initializedTree, setInitializedTree] = useState(false);
  if (!initializedTree && allParentCodes.length > 0) {
    setExpandedCodes(new Set(allParentCodes));
    setInitializedTree(true);
  }

  const handleToggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedCodes(new Set(allParentCodes));
  };

  const handleCollapseAll = () => {
    setExpandedCodes(new Set());
  };

  const isNodeExpanded = (code: string) => expandedCodes.has(code);

  return (
    <div className="catalog-tree-container">
      {/* Header y Acciones */}
      <header className="catalog-header">
        <div>
          <h2>Catálogo de Cuentas Contables</h2>
          <p className="catalog-subtitle">
            Estructura jerárquica: Clases, Grupos, Cuentas y Subcuentas
          </p>
        </div>

        <div className="catalog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExpandAll}
            disabled={isLoading || tree.length === 0}
          >
            Expandir Todo
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCollapseAll}
            disabled={isLoading || tree.length === 0}
          >
            Colapsar Todo
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refrescar
          </button>
        </div>
      </header>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="status-box loading-box">
          Cargando catálogo contable...
        </div>
      )}

      {isError && (
        <div className="status-box error-box">
          <p>
            <strong>Error:</strong> {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <button type="button" className="btn btn-outline" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      )}

      {/* Catálogo vacío */}
      {!isLoading && !isError && tree.length === 0 && (
        <div className="status-box empty-box">
          <p>No hay cuentas registradas en el catálogo actualmente.</p>
        </div>
      )}

      {/* Árbol jerárquico */}
      {!isLoading && !isError && tree.length > 0 && (
        <div className="tree-wrapper">
          <ul className="tree-root-list">
            {tree.map((rootAccount) => (
              <TreeNodeItem
                key={rootAccount.code}
                node={rootAccount}
                isExpanded={isNodeExpanded(rootAccount.code)}
                onToggleExpand={handleToggleExpand}
                isNodeExpanded={isNodeExpanded}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Panel de detalle de cuenta seleccionada */}
      {selectedNode && (
        <aside className="selected-node-panel">
          <h4>Detalle de la Cuenta</h4>
          <div className="node-detail-grid">
            <div>
              <strong>Código:</strong> {selectedNode.code}
            </div>
            <div>
              <strong>Nombre:</strong> {selectedNode.name}
            </div>
            <div>
              <strong>Nivel:</strong> {selectedNode.level}
            </div>
            <div>
              <strong>Naturaleza:</strong> {selectedNode.nature === 'DEBIT' ? 'Débito' : 'Crédito'}
            </div>
            <div>
              <strong>Padre:</strong> {selectedNode.parentCode || 'Ninguno (Clase Raíz)'}
            </div>
            <div>
              <strong>Admite movimientos:</strong>{' '}
              {selectedNode.allowsMovements ? 'Sí (Cuenta Hoja)' : 'No (Cuenta Agrupadora)'}
            </div>
          </div>
          <button
            type="button"
            className="btn-close-detail"
            onClick={() => setSelectedNode(null)}
          >
            Cerrar detalle
          </button>
        </aside>
      )}
    </div>
  );
}
