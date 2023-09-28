/** Interfaces para enviar los fraudes para asignar */
export interface AsignarFraudeUpdate {
  id:               number;
  usuario_asignado: number;
  prioridad1:       number;
  observacion:      string;
}

/** Interfaces para enviar los fraudes para agrupar */
export interface AgruparFraudeUpdate {
  id:               number;
  usuario_asignado: number;
  prioridad1:       number;
  observacion:      string;
  fk_grupo:         number;
}

/** Interfaces para enviar los fraudes para desagrupar */
export interface DesagruparFraudeUpdate {
  id:  number;
}

/** Interfaces para enviar los fraudes para desagrupar */
export interface DesasignarFraudeUpdate {
  id:  number;
}

/** Interfaces para crear grupo */
export interface CreateGrupo {
  nombre             : string;
  criterio_agrupacion: string;
}