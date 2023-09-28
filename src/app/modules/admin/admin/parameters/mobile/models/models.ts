export class MobileForm {
  id!: number;
  idEntity: number;
  inactivityTimeCta: number;
  inactivityUnitCta: string;
  inactivityTimeKey: number;
  inactivityUnitKey: string;
  maxRechargeLoad: number;
  maxBalanceAccount: number;
  maxNumberTrx: number;
  lockTimeCredentials: number;
  lockTimeChangeCell: number;
  unitLockChangeCell: string;
  lockTimeChangeMail: number;
  unitLockChangeMail: string;
  timeUpdateQr: number;
  unitUpdateQr: string;

  constructor(
    idEntity,
    inactivityTimeCta,
    inactivityUnitCta,
    inactivityTimeKey,
    inactivityUnitKey,
    maxRechargeLoad,
    maxBalanceAccount,
    maxNumberTrx,
    lockTimeCredentials,
    lockTimeChangeCell,
    unitLockChangeCell,
    lockTimeChangeMail,
    unitLockChangeMail,
    timeUpdateQr,
    unitUpdateQr
  ) {
    this.idEntity = idEntity;
    this.inactivityTimeCta = inactivityTimeCta;
    this.inactivityUnitCta = inactivityUnitCta;
    this.inactivityTimeKey = inactivityTimeKey;
    this.inactivityUnitKey = inactivityUnitKey;
    this.maxRechargeLoad = maxRechargeLoad;
    this.maxBalanceAccount = maxBalanceAccount;
    this.maxNumberTrx = maxNumberTrx;
    this.lockTimeCredentials = lockTimeCredentials;
    this.lockTimeChangeCell = lockTimeChangeCell;
    this.unitLockChangeCell = unitLockChangeCell;
    this.lockTimeChangeMail = lockTimeChangeMail;
    this.unitLockChangeMail = unitLockChangeMail;
    this.timeUpdateQr = timeUpdateQr;
    this.unitUpdateQr = unitUpdateQr;
  }
}

export interface IMobileForm {
  id?: number;
  idEntity?: number;
  inactivityTimeCta?: number;
  inactivityUnitCta?: string;
  inactivityTimeKey?: number;
  inactivityUnitKey?: string;
  maxRechargeLoad?: number;
  maxBalanceAccount?: number;
  maxNumberTrx?: number;
  maxNroTarjetas?: number;
  lockTimeCredentials?: number;
  lockTimeChangeCell?: number;
  unitLockChangeCell?: string;
  lockTimeChangeMail?: number;
  unitLockChangeMail?: string;
  timeUpdateQr?: number;
  unitUpdateQr?: string;
  maxAgeLogin?: number;
}
