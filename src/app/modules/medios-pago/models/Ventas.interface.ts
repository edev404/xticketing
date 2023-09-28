export interface VentasValid {
    source: Source;
    serial: number | string,
    fabricsr: boolean
}

interface Source {
    company: string,
    branch: string,
    entity: number
}

export interface CardInfo {
    serial:Transaction,
    value: number,
    message: string,
    avaliable: boolean
}

interface Transaction {
    source: Source
    serial: number | string,
    fabricsr: boolean,
    rawSerial: string,
    wrappedSerial: string
}
