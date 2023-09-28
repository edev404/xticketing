/** Interfaces para registrar analisis */
export interface RegistrarAnalisis {
    fkfraude:     number;
    fkCausa:      number;
    detCausa:     string;
    fkResolucion: number;
    fkAccion:     number;
    tipo:         string;
    usuarioRegi:  number;
    estado:       number;
    conclusion:   string;
}

/** Interfaces para registrar sancion */
export interface RegistrarSancion {
    fkfraude:      number;
    fkSancion:     number;
    detSancion:    string;
    fkApliSancion: string;
    observacion:   string;
    tipo:          string;
    usuarioRegi:   number;
    estado:        number;
}

/** Interfaces para fraudes analizados */
export interface FraudeAnalizado {
    id:           number;
    fkfraude:     number;
    detCausa:     string;
    fkResolucion: number;
    resolucion:   string;
    fkAccion:     number;
    accion:       string;
    fkCausa:      number;
    causa:        string;
    tipo:         string;
    usuarioRegi:  number;
    nomusuario:   string;
    fecha:        Date;
}

/** Interfaces para sanciones registradas  */
export interface SancionRegistrada {
    id:            number;
    fkfraude:      number;
    tipo:          string;
    detSancion:    string;
    observacion:   string;
    fkSancion:     number;
    sancion:       string;
    fkApliSancion: string;
    apliSancion:   string;
    usuarioRegi:   number;
    nomusuario:    string;
    fecha:         Date;
}

/** Interfaces para enviar notificaciones */
export interface EnviarNotificacion {
    fkfraude:      number;
    fkPlantilla:   number;
    fkMedio:       number;
    asunto:        string;
    cuerpoMensaje: string;
    tipo:          string;
    usuarioRegi:   number;
    usuarios:      any;
    estado:        number;
}

/** Interfaces de plantillas para enviar notificacion */
export interface PlantillaNotificacion {
    id:      number;
    nombre:  string;
    asunto:  string;
    mensaje: string;
    estado:  boolean;
}

/** Interfaces de usuarioso para enviar notificacion */
export interface UsuarioNotificacion {
    username:           string;
    nombre:             string;
    email:              string;
    canUpdateEmail:     boolean;
    canUpdateCellPhone: boolean;
}

/** Interfaces para notificaciones registradas */
export interface NotificacionRegistrada {
    id:            number;
    fkfraude:      number;
    tipo:          string;
    fkPlantilla:   number;
    plantilla:     string;
    fkMedio:       number;
    medio:         string;
    codigoMedio:   string;
    asunto:        string;
    cuerpoMensaje: string;
    usuarios:      any;
    usuario:       string;
    usuarioRegi:   number;
    nomusuario:    string;
    fecha:         Date;
    estado2:       string;
    fechaEnvio:    Date;
}

// Interfaces para modificar la notificacion
export interface UpdateNotificacion {
    id:            number;
    usuarios:      string;
    cuerpoMensaje: string;
    asunto:        string;
    fkPlantilla:   number;
    fkMedio:       number;
    estado:        number;
}
