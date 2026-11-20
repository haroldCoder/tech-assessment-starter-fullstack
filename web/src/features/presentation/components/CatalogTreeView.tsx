import { useState, useMemo } from 'react';
import { useCatalogTree } from '../hooks/useCatalogTree';
import { TreeToolbar } from './TreeToolbar';
import { TreeNodeItem } from './TreeNodeItem';
import { NodeDetailPanel } from './NodeDetailPanel';
import { CreateAccountModal } from './CreateAccountModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import type { AccountTreeNode } from '../../domain';

export function CatalogTreeView() {
  const { data: tree = [], isLoading, isError, error, refetch } = useCatalogTree();
  const [selectedNode, setSelectedNode] = useState<AccountTreeNode | null>(null);

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createParentCode, setCreateParentCode] = useState<string | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<AccountTreeNode | null>(null);

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

  // Conjunto de códigos actualmente expandidos
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(() => new Set());
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

  const handleExpandAll = () => setExpandedCodes(new Set(allParentCodes));
  const handleCollapseAll = () => setExpandedCodes(new Set());
  const isNodeExpanded = (code: string) => expandedCodes.has(code);

  const handleOpenCreateRoot = () => {
    setCreateParentCode(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenCreateChild = (parentCode: string) => {
    setCreateParentCode(parentCode);
    setIsCreateModalOpen(true);
  };

  const handleOpenDelete = (node: AccountTreeNode) => {
    setNodeToDelete(node);
  };

  return (
    <div className="catalog-tree-container">
      {/* Barra de herramientas superior */}
      <TreeToolbar
        isLoading={isLoading}
        hasAccounts={tree.length > 0}
        onOpenCreate={handleOpenCreateRoot}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onRefresh={() => refetch()}
      />

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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreateRoot}
          >
            Crear Primera Clase
          </button>
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
                onAddChild={handleOpenCreateChild}
                onDeleteNode={handleOpenDelete}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Panel de detalle de la cuenta */}
      <NodeDetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onAddChild={handleOpenCreateChild}
        onDeleteNode={handleOpenDelete}
      />

      {/* Modales de Crear y Eliminar */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultParentCode={createParentCode}
      />

      <DeleteAccountModal
        node={nodeToDelete}
        onClose={() => setNodeToDelete(null)}
      />
    </div>
  );
}
