interface TreeToolbarProps {
  isLoading: boolean;
  hasAccounts: boolean;
  onOpenCreate: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onRefresh: () => void;
}

export function TreeToolbar({
  isLoading,
  hasAccounts,
  onOpenCreate,
  onExpandAll,
  onCollapseAll,
  onRefresh,
}: TreeToolbarProps) {
  return (
    <header className="catalog-header">
      <div>
        <h2>Catálogo de Cuentas Contables</h2>
        <p className="catalog-subtitle">
          Estructura jerárquica con reglas de negocio DDD
        </p>
      </div>

      <div className="catalog-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenCreate}
        >
          + Nueva Cuenta
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExpandAll}
          disabled={isLoading || !hasAccounts}
        >
          Expandir Todo
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCollapseAll}
          disabled={isLoading || !hasAccounts}
        >
          Colapsar Todo
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={isLoading}
        >
          Refrescar
        </button>
      </div>
    </header>
  );
}
