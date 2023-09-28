/** Interfaces de entidades asignadas al usuario */
export interface EntityAssignedToUser {
    id:             number;
    userId:         number;
    username:       string;
    entities:       EntityByUser[];
    services:       ServiceByUser[];
    companies:      CompanyByUser[];
    default_entity: number;
}

/** Interfaces de empresas asignadas al usuario */
export interface CompanyByUser {
    id:     number;
    name:   string;
    code:   string;
    active: boolean;
    typeId: number;
}

/** Interfaces de entidades asignadas al usuario */
export interface EntityByUser {
    id:             number;
    name:           string;
    active:         boolean;
    stocktarjetas?: number;
}

/** Interface de servicios asignadas al usuario */
export interface ServiceByUser {
    id:     number;
    name:   string;
    active: boolean;
}