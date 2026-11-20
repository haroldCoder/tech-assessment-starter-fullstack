import { Account, AccountNature } from '../../domain/index.js';

export function createInitialSeedAccounts(): Account[] {
  // 1. Activo (Naturaleza: Débito)
  const activo = Account.createClass({
    code: '1',
    name: 'Activo',
    nature: AccountNature.DEBIT,
  });

  const disponible = Account.createChild(
    { code: '11', name: 'Disponible' },
    activo,
  );

  const caja = Account.createChild(
    { code: '1105', name: 'Caja' },
    disponible,
  );

  const cajaGeneral = Account.createChild(
    { code: '110505', name: 'Caja General' },
    caja,
  );

  const cajasMenores = Account.createChild(
    { code: '110510', name: 'Cajas Menores' },
    caja,
  );

  const bancos = Account.createChild(
    { code: '1110', name: 'Bancos' },
    disponible,
  );

  const bancosNacionales = Account.createChild(
    { code: '111005', name: 'Moneda Nacional' },
    bancos,
  );

  // 2. Pasivo (Naturaleza: Crédito)
  const pasivo = Account.createClass({
    code: '2',
    name: 'Pasivo',
    nature: AccountNature.CREDIT,
  });

  const proveedores = Account.createChild(
    { code: '22', name: 'Proveedores' },
    pasivo,
  );

  const proveedoresNacionales = Account.createChild(
    { code: '2205', name: 'Nacionales' },
    proveedores,
  );

  const proveedoresVarios = Account.createChild(
    { code: '220505', name: 'Proveedores del País' },
    proveedoresNacionales,
  );

  // 3. Patrimonio (Naturaleza: Crédito)
  const patrimonio = Account.createClass({
    code: '3',
    name: 'Patrimonio',
    nature: AccountNature.CREDIT,
  });

  const capitalSocial = Account.createChild(
    { code: '31', name: 'Capital Social' },
    patrimonio,
  );

  const capitalSuscritoYPagado = Account.createChild(
    { code: '3105', name: 'Capital Suscrito y Pagado' },
    capitalSocial,
  );

  return [
    activo,
    disponible,
    caja,
    cajaGeneral,
    cajasMenores,
    bancos,
    bancosNacionales,
    pasivo,
    proveedores,
    proveedoresNacionales,
    proveedoresVarios,
    patrimonio,
    capitalSocial,
    capitalSuscritoYPagado,
  ];
}
