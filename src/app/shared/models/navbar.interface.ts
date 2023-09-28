interface Action {
    id?: number;
    code?: string;
    name?: string;
    parentId?: number;
}

export interface Navbar {
    id?: number;
    code?: string;
    name?: string;
    icon?: string;
    path?: string;
    active: boolean;
    accion?: Action[];
    categoria?: Categoria[];
}

interface Categoria {
    id?: number;
    code?: string[];
    name?: string;
    path?: string;
    subActions?: any[];
}
// Navbar
interface City {
    id: number;
    code: string;
    name: string;
    departmentId: number;
}

interface Country {
    id: number;
    code: string;
    name: string;
}

interface Department {
    id: number;
    code: string;
    name: string;
    countryId: number;
}

interface Location {
    city: City;
    country: Country;
    department: Department;
}

export interface Data {
    active: boolean;
    code: number;
    correo_stock: string;
    description: string;
    direction: string;
    geographicalAreas: string;
    id: number;
    location: Location;
    logo: string;
    mail: string;
    messageInstitutional: string;
    name: string;
    phone: string;
    stocktarjetas: number;
    style: string;
    webSite: string;
}

export interface Logo {
    id?: number;
    nombre?: string;
    logoUrl?: string;
}