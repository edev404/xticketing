export interface IReporte {
    id: number;
    name: string;
    path: string;
    estado?: boolean;
}

export interface IPQR {
    id?: number;
    codigo?: string;
    nombre?: string;
    activa?: boolean;
}
export interface  IAcciones{
    codigo?: string;
    descripcion?:  string;
    estado?:  boolean;
    id?: number;
    idEntidad?: number;
    idlista?:  number;
    ordenPosicion?: number;
}

export interface IEstados {
    active?: boolean;
    codEstado?: string;
    fechaActual?: Date;
    id?: number;
    idMaestro?: number;
    nombre?: string;
    programa?: string;
    descripcion?: string;
    reqObservacion?: string;
    falsereqValor?: boolean;
}

export interface IPerfilRelacion {
    id?: number;
    codigo?: string;
    nombre?: string;
    acciones?: IPerfilRelacionAccionesEstados[];
    estados?: IPerfilRelacionAccionesEstados[];
    activa?: boolean;
}

export interface IPerfilRelacionAccionesEstados {
    cod_accion?: string;
    estado_relacionado?: boolean; 
    id_accion?: number;
    id_lista?: number;
    nombre_accion?: string;
    codigo_estado?: string;
    id_estado?: number;
    id_maestro?: number;
    nombre_estado?: string;
}

export interface AccionesEstados {
    estado: boolean;
    idAccion: number;
    codigo: string;
    descripcion: string;
    idEntidad: number;
    idEstado: number;
    fechaActualizacion: string;
    programa: string;
    nombre: string;
    usuarioBd: string;
}


export interface TipoPqr {
    id: number;
    descripcion: string;
    plazo: number;
    estado: string;
}

export interface MotivoPqr {
    id: number;
    descripcion: string;
    codTpqr: number;
    estado: string;
}
  