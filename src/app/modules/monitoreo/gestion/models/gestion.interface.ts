export interface Gestion {
    fecha: string; // Debes ajustar el tipo según el formato real de fecha en tu aplicación
    id_empresa: number;
    empresa: string;
    id_validador: number;
    id_vehiculo?: number;
    nro_interno?: number;
    tipo_evento: string;
    descripcion: string;
    id_viaje?: number;
    id_ruta?: number;
    nombre?: string;
    cant_eventos: number;
}