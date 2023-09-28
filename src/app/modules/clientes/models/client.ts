import {ILocation} from './location';

export class IClient {
    type?: number | null;
    document?: number | null;
    name?: string | null = '';
    lastName?: string | null;
    cellPhone?: string | null;
    email?: string | null = '';
    genderId?: number | null;
    stateId?: number | null;
    professionId?: number | null;
    dateInit?: Date | null;
    datEnd?: Date | null;
    bornLocation?: ILocation | null = new ILocation;
    residenceLocation?: ILocation | null = new ILocation;
    numberAccount?: number | null;
    typeAccount?: number | null;
    userName?: string | null;
    numberCard?: number | null;
    profileAccount?: number | null;
    dateInitCard?: Date | null;
    datEndCard?: Date | null;
}

export interface IexportDetailAccount {
    numberAccount?: string;
    formatFile?: string;
    dateInit?: Date;
    datEnd?: Date;
}

export interface IhistoricalState {
    id?: number;
    idState?: number;
    nameState?: string;
    idClient?: number;
    dateCreation: Date;
}

export interface IStatementAccount {
    id?: string;
    date?: string;
    lugar?: string;
    transferdescription?: string;
    trasferid?: string;
    transactionType?:any;
    amount?: number;
}

export interface IPassengerAccount {
    accountNo?: string;
    profileAccount?: number;
    date?: Date;
    summary?: any;
}

export interface IStatePassengerAccount {
    motiveId?: number;
    description?: string;
}
