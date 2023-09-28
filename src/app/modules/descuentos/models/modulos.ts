export class IDiscount {
  id?: number;
  name?: string;
  value?: number;
  serviceId?: number;
  dateInit!: Date;
  datEnd?: Date;
  discountUnit?: number;
  frequency?: number;
  frequencyUnit?: number;
  percentaje?: boolean;
  condition?: string;
  alwaysHour?: boolean;
  rangeHour?: boolean;
  timeTerm!: ITimeTerm;
  geographi!: any;
  geographiName?: any;
  active?: boolean;
  userTerm!: IUserTerm;
  nameService?: string;
  idDiscount?: number;
}

export class ITimeTerm {
  alwaysHours!: boolean;
  rangeHours!: boolean;
  hourInitial!: string;
  hourFinally!: string;
  days!: any;
  nameDays!: string;
}

export class IUserTerm {
  initialAge!: number;
  finalAge!: number;
  professionId!: number;
  bornLocation!: ILocation;
  residenceLocation!: ILocation;
}

export class ICity {
  id?: string;
  code?: string;
  name?: string;
  departmentId?: string;
}

export class IDepartment {
  id?: string;
  code?: string;
  name?: string;
  countryId?: string;
}

export class ICountry {
  id?: string;
  code?: string;
  name?: string;
}

export class ILocation {
  country!: ICountry;
  department!: IDepartment;
  city!: ICity;
}

export class IDistcountAssignerMassive {
  servicesId!: number;
  value!: number;
  maxAge!: number;
  minAge!: number;
  professionId!: number;
  discountId!: number;
  startVigency!: string;
  endVigency!: string;
  bornLocation!: ILocation;
  residenceLocation!: ILocation;
  action!: string;
  templateId!: number;
}

export class IDistcountMassive {
  id?: number;
  fkService?: number;
  serviceName?: string;
  fkDescuento?: number;
  descuentoName?: string;
  vigenciaIn?: Date;
  vigenciaFin?: Date;
  fkAccion?: number;
  fkPlantilla?: number;
  nombrePlantilla?: string;
  evidencia?: string;
  vigente?: boolean;
  active?: boolean;
}

interface DescuentoDTO {
  success: number;
  failed: number;
  discountId: number;
}

interface descuentoDateDTO {
  discount: DescuentoDTO;
}

export interface DescuentoDetalleDTO {
  status: string;
  data: string;
  discount: descuentoDateDTO;
}
// Detalle del descuento.
export interface DistcountDetail {
  id?: number;
  idDiscount?: number;
  name?: string;
  statusAssigned?: boolean;
  statusValidity?: boolean;
  active?: boolean;
  idService?: number;
  keyDocument?: string;
  nameDocument?: string;
  nameService?: string;
  dateCreation?: string;
  dateInit?: Date;
  datEnd?: Date;
}

export class IPassenger {
  id!: number;
  cardId!: number;
  card?;
  firstName?;
  secondName?;
  lastName?;
  secondLastName?;
  identificationTypeId?: number;
  identificationType?;
  identification?;
  bornDate?;
  age?;
  cellPhone?;
  email?;
  bornLocation?: ILocation;
  residenceLocation?: ILocation;
  address?;
  occupationId?: number;
  occupation?;
  genderId?: number;
  gender?;
  maritalStateId?: number;
  maritalState?;
  active?;
  canUpdateEmail?;
  canUpdateCellPhone?;
  accountProfile?;
  idCompany?;
  numberAccount?;
  typeAccount?;
  stateAccount?;
  phone?;
  type?;
  idStateAccount?;
  idSavings?;
  idClientExternal?;
  genderCode?;
  account?;
}
