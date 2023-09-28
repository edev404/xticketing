export class Company {
  id!: number;
  code!: string;
  name!: string;
  active!: boolean;
  typeId!: number;
}

export class Collect {
  id!: number;
  date!: string;
  travel!: Travel;
  passengers!: number;
  stateId!: number;
  motiveId!: number | null;
  collect!: number;
  manualCollect!: number;
  valueMissing!: number;
  observation!: string | null;
  balance!: number;
  userCreatorId!: number;
  drive!: string;
  totalBarras!: number;
  totalRecaudado!: number;
  pasajerosBarras!: number;
}

export class Travel {
  id!: number;
  startDate!: string;
  endDate!: string;
  plate!: string;
  driver!: string;
  xtTravelId!: number;
  routeId!: number;
  route?: Route;
  vehicleId!: string;
  internalNumber!: string;
}

export class Route {
  id!: any;
  code!: string;
  name!: string;
  type!: string;
  hasZones!: boolean;
  active!: boolean;
  fareTypeId!: number;
  transfer!: Transfer;
  configId?: any;
  havetransfer!: boolean;
  pendingRequest!: boolean;
  applyAnotherCompanies!: boolean;
  hasRequestPendings!: boolean;
}

export interface Transfer {
  id?: number;
  routeid?: number;
  routesallowed?: string;
  routesallowedlist?: RoutesAllowedlist[];
  username?: string;
}

export interface RoutesAllowedlist {
  id?: number;
  code?: string;
  name?: string;
  process?: string;
  state?: boolean;
  status?: boolean | null;
  configId?: Number;
  transferitemslist?: TermsList[];
  transferZoneItems?: TermsZone[];
  transfertermitems?: string;
  transferpaymentitems?: string;
  validityStartDate?: string;
  validityEndDate?: string;
  companyId?: number;
  transferId?: number;
  company?: any;
  route?: any;
  iscreate?: boolean;
  companyName?: any;
}

export interface TermsZone {
  code?: string,
  zone?: number,
  iscreated?: boolean;
}

export interface TermsList {
  id?: number;
  type: string;
  firtsvalue?: number;
  lastvalue?: number;
  code?: string;
  range?: string;
  iscreate?: boolean;
}

export interface CollectInfo {
  state?: string;
  motive?: string;
  observation?: string | null;
  manualCollect?: number;
  balance?: number;
  valueRequired?: boolean;
  collect?: number;
}

export interface Trazability {
  idColletion: number;
  idTravel: number;
  valueCollet: number | undefined;
  cashier: string | undefined;
  date: string;
  typeCollect: string;
  drive?: string;
}

export interface Outstanding {
  id?: number;
  idColletion?: number;
  solveValue?: number;
  valueToSolve?: number;
  totalSolveValue?: number | null;
  proposedAction?: string;
  situationContext?: string;
  solutionDescription?: string;
  responsable?: string;
  dateEstimate?: string;
  solutionExecute?: string;
  dateEjecution?: string;
  byExecute?: string;
  active?: boolean;
  status?: number;
  idTravel?: number;
  drive?: string;
}

export interface Novelty {
  id: number;
  name: string;
  description: string;
  code: string;
  alert: boolean;
  date: string;
  collectId: number;
}

export interface Zone {
  id: number;
  name: string;
  code: string;
  ups: number;
  downs: number;
  blocks: number;
  qrUps: number;
  cardUps: number;
  transferUps: number;
  order: number;
  realityNumber: number;
}