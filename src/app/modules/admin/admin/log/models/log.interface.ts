export interface Log {
    id: string;
    user: string;
    operation: string;
    ip: string;
    hour: string;
    affectedFields: string | null;
    dateTime: string;
    nameApp: string;
    transaction: string | null;
    text: string | null;
    description: string;
    imei: string | null;
    geographiUbication: string | null;
    account: string | null;
    cellphone: string;
    operationResult: string | null;
    destAccountEnrolled: string | null;
    value: string | null;
    motive: string | null;
    service: string;
    previousCell: string | null;
    statusPreSettlement: string | null;
    statusTraceability: string | null;
    card: string | null;
    idDevice: string;
    driver: string | null;
    valueRecordedReceived: string | null;
    valueCashCollect: string | null;
    result: string | null;
    missingValue: string | null;
    surpus: string | null;
    travel: string | null;
    drive: string | null;
    options: string | null;
    externalTravel: string | null;
    enteRecaudador: string | null;
}