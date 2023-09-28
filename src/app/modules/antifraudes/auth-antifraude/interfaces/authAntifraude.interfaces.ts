export interface IAuthAntifraude {
    user: string;
    password: string;
}

export interface IUser {
    token: string;
    user:  User;
}

export interface User {
    id:                 number;
    username:           string;
    firstName:          string;
    secondName:         string;
    lastName:           string;
    secondLastName:     string;
    email:              string;
    cellPhone:          string;
    profileId:          number;
    profile:            string;
    lastAccess:         Date;
    lastPasswordChange: Date;
    userCreator:        string;
    active:             boolean;
    canUpdateEmail:     boolean;
    canUpdateCellPhone: boolean;
    temporalPassword:   boolean;
    statusPeriodicity:  number;
    entities:           Entity[];
    services:           Company[];
    companies:          Company[];
}

export interface Company {
    id:     number;
    name:   string;
    code?:  string;
    active: boolean;
}

export interface Entity {
    id:             number;
    name:           string;
    active:         boolean;
    default_entity: number;
    stocktarjetas:  number;
}
