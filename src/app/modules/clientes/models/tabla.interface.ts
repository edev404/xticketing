export interface Tabla {
    tipoDocumento: string;
    documento: number;
    nombre: string;
    apellido: string;
    correoElectronico: string;
    telefono: number;
    tipoDeCuenta: string;
    perfilDeCuenta: string;
    numeroDeCuenta: number;
    fechaDeRegistro: Date;
}

export interface UserInfo {
    id: number;
    cards: Card[];
    card: string;
    account: string;
    firstName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    identificationTypeId: number;
    identificationType: string;
    identification: string;
    bornDate: string;
    age: number;
    cellPhone: string;
    email: string;
    bornLocation: Location;
    residenceLocation: Location;
    address: string;
    occupationId: number;
    occupation: string;
    genderId: number;
    gender: string;
    maritalStateId: number;
    maritalState: string;
    active: boolean;
    canUpdateEmail: boolean;
    canUpdateCellPhone: boolean;
    typeAccount: string;
    accountProfile: number;
    type: number;
    professionId: number;
    profileAccount: number;
    document: number;
    phone: string;
    name: string;
    lastname: string;
    dateInit: string;
    datEnd: string;
    numberAccount: string;
    numberCard: string;
    dateInitCard: string;
    datEndCard: string;
    municipalityOfBirth: string;
    departmentOfBirth: string;
    countryOfBirth: string;
    municipalityResidence: string;
    departmentResidence: string;
    countryResidence: string;
    idStateAccount: number;
    idSavings: number;
    dateRegister: Date;
    nameTypeAccount: string;
    nameProfileAccount: string;
}

interface Card {
    active: boolean;
    blocked: boolean;
    unsubscribed: boolean;
    initialized: boolean;
}

interface Location {
    country: Country;
    department: Department;
    city: City;
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

interface City {
    id: number;
    code: string;
    name: string;
    departmentId: number;
}

export interface Cuenta {
    number: string;
    active: boolean;
    blocked: boolean;
    unsubscribed: boolean;
    idCard: number;
    idPassenger: number;
    idStateAccount: number;
    idAccount: number;
    dateRegister: string;
    nameStateAccount: string;
    initialized: boolean;
  }