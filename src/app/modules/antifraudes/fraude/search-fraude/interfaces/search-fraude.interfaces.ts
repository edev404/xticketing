export interface SearchFraude {
    // Información básica
    fecha_ini_re:  Date | string;
    fecha_fin_re:  Date | string;
    fecha_ini_ocu: Date | string;
    fecha_fin_ocu: Date | string;
    estado:        string;
    id:            number;
    descripcion:   string;
    tipo_fraude:   string;
    componente:    string;
    fuente:        string;
    // Información avanzada
    usuario:       string;
    riesgo:        string;
    impacto:       string;
    empresa:       string;
    servicio:      string;
}


export interface UsuariosFraude {
    id:                 number;
    firstName:          string;
    lastName:           string;
    canUpdateEmail:     boolean;
    canUpdateCellPhone: boolean;
}
