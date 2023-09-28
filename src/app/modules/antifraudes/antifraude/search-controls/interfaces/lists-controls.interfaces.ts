/** Interface para objetos listas */
export interface TipoLista {
    // Id de lista
    id:          number;
    // Id de las listas
    idlista:     number;
    // Nombre de la lista a quien pertenece
    nameList:    NameList;
    // Codigo 
    code:        string;
    // Descripción
    description: string;
    // Orden de los campos
    order:       number;
    // Activo
    active:      boolean;
    // disabled (atributo para deshabilitar en los campos tipo listas)
    disabled:     boolean;
}

/** Nombre de la lista a quien pertenece */
export interface NameList {
    id:     number;
    name:   string;
    active: boolean;
}
