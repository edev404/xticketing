export interface IAdminListConfiguration {
  id?: number;
  idlista?: number;
  active?: boolean;
  order?: string;
  code?: string;
  description?: string;
  id_entidad?: number;
}

export interface INameListConfiguration {
  id?: number;
  name?: string;
}

export class GeneralForm {
  transferNumber;
  minimunBalance;
  inactivityTime;
  inactivityTimeUnity;
  minQuantityCardByLot;
  maxQuantityCardByLot;
  collectTypeId;
  collectPassengersCantId;
  limitDataToDisplay;
  limitTimeSession;
  allowsCredit;
  espera_validador;
  tiempo_listas;
  valor_tarjeta;

  constructor(
    transferNumber,
    minimunBalance,
    inactivityTime,
    inactivityTimeUnity,
    minQuantityCardByLot,
    maxQuantityCardByLot,
    collectTypeId,
    collectPassengersCantId,
    limitDataToDisplay,
    limitTimeSession,
    allowsCredit,
    espera_validador,
    tiempo_listas,
    valor_tarjeta
  ) {
    this.transferNumber = transferNumber;
    this.minimunBalance = minimunBalance;
    this.inactivityTime = inactivityTime;
    this.inactivityTimeUnity = inactivityTimeUnity;
    this.minQuantityCardByLot = minQuantityCardByLot;
    this.maxQuantityCardByLot = maxQuantityCardByLot;
    this.collectTypeId = collectTypeId;
    this.collectPassengersCantId = collectPassengersCantId;
    this.limitDataToDisplay = limitDataToDisplay;
    this.limitTimeSession = limitTimeSession;
    this.allowsCredit = allowsCredit;
    this.espera_validador = espera_validador;
    this.tiempo_listas = tiempo_listas;
    this.valor_tarjeta = valor_tarjeta
  }
}

export interface Plantilla {
  id?: number;
  idFile?: string;
  name: string;
  format?: string;
  extensions: string;
}

export interface PlantillaEmail {
  id?: number;
  nombre?: string;
  mensaje: string;
  estado?: boolean;
}

export interface Notificacion {
  nombre: string;
  asunto: string;
  mensaje: string;
  estado: boolean;
}