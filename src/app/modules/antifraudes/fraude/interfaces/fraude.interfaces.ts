// Interfaces de respuesta del backend con grupos de fraudes y fraudes
export interface ResponseSearchFraudes {
    fraudes: Fraude[];
    grupos:  Grupo[];
}

export interface Grupo {
    id:                  number;
    nombre:              string;
    criterio_agrupacion: string;
    analista:            string;
    observacion:         string;
    fraudes:             Fraude[];
    /** Variable para validar que es un grupo */
    isGroup:             boolean;
    /** Variable para mostrar los fraudes */
    expandFraude:        boolean;
    /** Variable para verificar que estado es el grupo */
    estado:              string;
}

// Interfaces para ver Fraude en la tabla
export interface Fraude {
    id:                        number;
    fecha_creacion:            Date;
    fecha_probable_ocurrencia: Date;
    descripcion:               string;
    fk_tipo_fraude:            number;
    tipo_fraude:               string; 
    fk_componente:             number;
    componente:                string;
    fk_fuente:                 number;
    fuente:                    string; 
    fk_impacto:                number;
    impacto:                   string; 
    fk_servicio:               number | string | null;
    servicio:                  string;
    riesgo:                    string;
    fk_empresa:                string | null;
    empresa:                   string;
    estado:                    boolean;
    estado_anti:               string;
    estado_antifraude:         number;
    usuario:                   number;
    nomUsuario:                string;
    usuario_asignado:          number;
    noUserAsig:                string;
    prioridad:                 string;
    prioridad1:                number;
    observacion:               string;
    fkControlActivo:           number;
}

// Interfaces para crear fraude
export type FraudeCreate = Pick<Fraude, 'fecha_probable_ocurrencia' | 
                                        'descripcion' | 
                                        'fk_tipo_fraude' | 
                                        'fk_componente' | 
                                        'fk_fuente' | 
                                        'riesgo' | 
                                        'fk_impacto' | 
                                        'fk_servicio' | 
                                        'fk_empresa' | 
                                        'estado' | 
                                        'estado_antifraude' | 
                                        'usuario' |
                                        'fkControlActivo'>;

// Interfaces para controles activos
export interface ControlActivo {
    id:      number,
    codigo:  string;
    control: string;
    // CHANGE LUIS
    causa: string;
}
