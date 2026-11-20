import type { AccountTreeNode } from '../../domain';

interface NodeBadgesProps {
  level: AccountTreeNode['level'];
  nature: AccountTreeNode['nature'];
  allowsMovements: boolean;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  CLASS: { label: 'Clase', color: '#1e40af', bg: '#dbeafe' },
  GROUP: { label: 'Grupo', color: '#0369a1', bg: '#e0f2fe' },
  ACCOUNT: { label: 'Cuenta', color: '#4338ca', bg: '#ede9fe' },
  SUBACCOUNT: { label: 'Subcuenta', color: '#374151', bg: '#f3f4f6' },
};

export function NodeBadges({ level, nature, allowsMovements }: NodeBadgesProps) {
  const levelInfo = LEVEL_CONFIG[level] || {
    label: level,
    color: '#374151',
    bg: '#f3f4f6',
  };

  return (
    <>
      <span
        className="badge-level"
        style={{ color: levelInfo.color, backgroundColor: levelInfo.bg }}
      >
        {levelInfo.label}
      </span>

      <span className={`badge-nature ${nature === 'DEBIT' ? 'nature-debit' : 'nature-credit'}`}>
        {nature === 'DEBIT' ? 'Débito' : 'Crédito'}
      </span>

      {allowsMovements ? (
        <span className="badge-movement movement-allowed" title="No tiene hijas: admite asientos directos">
          ✓ Movimiento
        </span>
      ) : (
        <span className="badge-movement movement-blocked" title="Tiene cuentas hijas: cuenta agrupadora">
          Agrupadora
        </span>
      )}
    </>
  );
}
