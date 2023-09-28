export interface AccionMasiva {
  id:          number;
  description: string;
  disabled:    boolean;
}

/** Lista de Acciones masivas, 1 asignar, 2 desasignar, 3 desagrupas, 4 dividir */
export const accionesMasivasPendiente: AccionMasiva[] = [
  { id: 1, description: 'Asignar',        disabled: true },
  { id: 5, description: 'Agrupar',        disabled: true },
  { id: 3, description: 'Desagrupar',     disabled: true },
  { id: 4, description: 'Dividir grupo',  disabled: true },
  { id: 2, description: 'Desasignar',     disabled: true },
  { id: 6, description: 'Analizar',       disabled: true }
];

/** Lista de Acciones masivas, 1 asignar, 2 desasignar, 3 desagrupas, 4 dividir */
export const accionesMasivasAnalizar: AccionMasiva[] = [
  { id: 1, description: 'Asignar',        disabled: true },
  { id: 5, description: 'Agrupar',        disabled: true },
  { id: 3, description: 'Desagrupar',     disabled: true },
  { id: 4, description: 'Dividir grupo',  disabled: true },
  { id: 2, description: 'Desasignar',     disabled: true },
  { id: 6, description: 'Analizar',       disabled: true }
];

/** Lista de Acciones masivas, 1 asignar, 2 desasignar, 3 desagrupas, 4 dividir */
export const accionesMasivasCerrados: AccionMasiva[] = [
  { id: 1, description: 'Asignar',        disabled: true },
  { id: 5, description: 'Agrupar',        disabled: true },
  { id: 3, description: 'Desagrupar',     disabled: true },
  { id: 4, description: 'Dividir grupo',  disabled: true },
  { id: 2, description: 'Desasignar',     disabled: true },
  { id: 6, description: 'Analizar',       disabled: true }
];