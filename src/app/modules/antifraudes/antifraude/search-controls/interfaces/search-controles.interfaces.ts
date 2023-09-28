/** Interfaces para buscar controles */
export interface SearchControl {
    // Información básica
    estado:            string;
    codigo:            string;
    control:           string;
    tipo_control:      string;
    componente:        string;
    descripcion:       string;
    // Información avanzada
    criticidad:        string;
    fuente:            string;
    deteccion:         string;
    accion_resultante: string;
    servicio:          string;
    empresa:           string;
    /** Checkbox para controles activados */
    activo:            boolean;
    /** Controles activados */
    fecha_ini:         Date | string;
    fecha_fin:         Date | string;
    serviceac:         number;
    empreac:           number;
    causa:             string;
    accion_eje:        string;
}

/** Interfaces para mostrar en la tabla */
export interface ControlView {
    id:                number;
    codigo:            string;
    control:           string;
    tipo_control:      string;
    componente:        string;
    descripcion:       string;
    criticidad:        string;
    fuente:            string;
    deteccion:         string;
    accion_resultante: string;
    empresa:           string;
    estado:            number;
    servicio:          number;
    trazabilidad?:     Trazabilidad[];
    servicioEmpresa?:  ServicioEmpresa[];
}

export interface ServicioEmpresa {
    id:       number;
    estado:   number;
    servicio: string;
    empresa:  string;
    fecha:    string;
}

export interface Trazabilidad {
    id:                  number;
    fecha_registro:      Date;
    causa:               string;
    acciones_ejecutadas: string;
    servicio:            string;
    empresa:             string;
    usuario:             string;
}