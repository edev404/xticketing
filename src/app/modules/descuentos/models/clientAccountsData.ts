export class ClientAccountsData{

    nombre?: number;
    identificacion?: string;
    idClienteExterno?: number;
    tarjeta?: string;
    cuenta!: number;
    saldo?: number;
    
}


export interface Validaciones {
    validation: Estado;
    passenger: any;
    status: boolean;
}

interface Estado {
    success: boolean;
    message: string;
}