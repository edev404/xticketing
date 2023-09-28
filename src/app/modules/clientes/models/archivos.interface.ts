export interface IPlantillas {
    activa: boolean;
    id: number;
    nombre: string
    separador: string
    tabla: string
    tipo: "Subida" | "Bajada"
}
export interface IArchivoValidacion {
    bdColumn: string;
    comment: string;
    dataType: string;
    defaults: string;
    formatId: number;
    function: string | null;
    id: number;
    longMax: number;
    name: string;
    nule: boolean;
    order: number;
    sworAlert: boolean | null;
}

export interface IArchivoDatosEnvio {
    nombre?: string;
    fechaSubida?: Date;
    totalRegistros?: number;
    cargados?: number;
    fallidos?: number;
    usuario?: string;
    active?: boolean;
    extension?: string;
}
export interface IArchivoDato {
    key: any;
}
export interface IArchivoDatosError {
    registro: IArchivoDato[];
    fila: number;
    fecha?: Date;
    codigo: string;
    tipo: string;
    descripcion: string;
    mensajeError: string;
    evaluacionesCeldas: IMensajeError[];
}
export interface IMensajeError {
    id?: number;
    tipo?: string;
    fila?: string;
    fecha?: string;
    columna?: IArchivoValidacion;
    descripcion?: string;
    mensaje?: string;
}
export interface TmpDataFile {
    id?: number;
    idFIle?: number;
    user?: string;
    state?: boolean;
    sqlInsert?: string;
    sqlUpdate?: string;
    dato1?: string;
    dato2?: string;
    dato3?: string;
    dato4?: string;
    dato5?: string;
    dato6?: string;
    dato7?: string;
    dato8?: string;
    dato9?: string;
    dato10?: string;
    dato11?: string;
    dato12?: string;
    dato13?: string;
    dato14?: string;
    dato15?: string;
    dato16?: string;
    dato17?: string;
    dato18?: string;
    dato19?: string;
    dato20?: string;
    dato21?: string;
    dato22?: string;
    dato23?: string;
    dato24?: string;
    dato25?: string;
    dato26?: string;
    dato27?: string;
    dato28?: string;
    dato29?: string;
    dato30?: string;
    dato31?: string;
    dato32?: string;
    dato33?: string;
    dato34?: string;
    dato35?: string;
    dato36?: string;
    dato37?: string;
    dato38?: string;
    dato39?: string;
    dato40?: string;
    dato41?: string;
    dato42?: string;
    dato43?: string;
    dato44?: string;
    dato45?: string;
    dato46?: string;
    dato47?: string;
    dato48?: string;
    dato49?: string;
    dato50?: string;
    dato51?: string;
    dato52?: string;
    dato53?: string;
    dato54?: string;
    dato55?: string;
    dato56?: string;
    dato57?: string;
    dato58?: string;
    dato59?: string;
    dato60?: string;
    dato61?: string;
    dato62?: string;
    dato63?: string;
    dato64?: string;
    dato65?: string;
    dato66?: string;
    dato67?: string;
    dato68?: string;
    dato69?: string;
    dato70?: string;
    dato71?: string;
    dato72?: string;
    dato73?: string;
    dato74?: string;
    dato75?: string;
    dato76?: string;
    dato77?: string;
    dato78?: string;
    dato79?: string;
    dato80?: string;
}

export interface TmpTemplate {
    id?: number;
    nombre?: string;
    fecha?: Date;
    estado?: boolean;
}

export interface DataEvaluada {
    id: number;
    nombreFile: string;
    registro: IArchivoDato;
    extension: string;
}
export interface DescargarData {
    nombre?: string | undefined;
    formato?: string | undefined;
    index?: number;
}