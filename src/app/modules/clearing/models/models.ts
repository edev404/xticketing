export interface Presettlement {
  id?: any;
  createDate?: any;
  city?: any;
  company?: any;
  fromDate?: any;
  toDate?: any;
  state?: any;
}

export interface PresettlementFilter {
  month?: any;
  year?: any;
  monthYear?: any;
  fromDate?: any;
  toDate?: any;
  base?: any;
  city?: any;
  percentageSetting?: any;
  company?: any;
}

export interface Clearing {
  id: number;
  city: City;
  company: City;
  validityStartDate: string;
  validityEndDate: string;
  state: State;
  date: string;
  rechargeDetails: any[];
  ticketDetails: TicketDetail[];
}

export interface City {
  id: number;
  name: string;
}

export interface State {
  id: number;
  code: string;
  description: string;
}

export interface TicketDetail {
  id: number;
  collected: number;
  payment: number;
  date: string;
  involvedId: number;
}

export interface Finding {
  id?: number;
  clearingId?: number;
  type?: Type;
  description?: string;
  proposalSolution?: string;
  proposalDate?: string;
  responsible?: User;
  date?: any;
  solved?: boolean;
  solution?: string;
  solutionDate?: string;
  solutioner?: User;
  creator?: User;
}

export interface Type {
  id: number;
  description: string;
}

export interface ClearingRechargeDetails {
  branchOffices?: DetailsSelected[];
  detail?: RechargeDetail;
  state?: any;
  filter?: any;
}

export interface DetailsSelected {
  id?: number;
  name?: string;
  collectedValue?: number;
  valueToPay?: number;
  totalcollect?:number;
  collectCard?:number;
  date?: string;
  weekNumber?: number;
}

export interface RechargeDetail {
  companyId?: number;
  companyName?: string;
  collectedValue?: number;
  percentage?: number;
  valueToPay?: number;
  startDate?: string;
  endDate?: string;
}

export interface User {
  id?: number;
  name?: string;
  lastName?: string;
}

export interface InvolvedDistribution {
  involvedId?: number;
  involvedName?: string;
  percentage?: number;
  valueToPay?: number;
}

export interface ClearingDataPassages {
  distributions?: InvolvedDistribution[];
  collect?: ClearingCollectsData;
  detail?: ClearingDetailsData;
  state?: any;
  company?: any;
  validityStartDate?: any;
  validityEndDate?: any;
}

export interface ClearingCollectsData {
  collects?: CollectsClearingPassages[];
  periodSelected?: number;
  collectSelected?: CollectsClearingPassages;
  routesCollect?: RoutesCollectsClearingPassages[];
  routesCollectSelected?: RoutesCollectsClearingPassages;
  vehiclesCollect?: VehicleCollectsClearingPassages[];
  vehicleCollectSelected?: VehicleCollectsClearingPassages;
  travelsCollect?: TravelCollectsClearingPassages[];
  travelCollectSelected?: TravelCollectsClearingPassages;
  passenger?: InfoPassenger[];
  collectsShower?: CollectsClearingPassages[];
  routesShower?: RoutesCollectsClearingPassages[];
  travelsShower?: TravelCollectsClearingPassages[];
  vehiclesShower?: VehicleCollectsClearingPassages[];
}

export interface CollectsClearingPassages {
  date?: string;
  cardValue?: number;
  cardCant?: number;
  cashValue?: number;
  cashCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  qrValue?: number;
  qrCant?: number;
  totalCant?: number;
}

export interface RoutesCollectsClearingPassages {
  routeId?: number;
  routeName?: string;
  cardValue?: number;
  cardCant?: number;
  cashValue?: number;
  cashCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  date?: string;
  weekNumber?: number;
  qrValue?: number;
  qrCant?: number;
  totalCant?: number;
}

export interface VehicleCollectsClearingPassages {
  date?: string;
  vehicleId?: string;
  internalNumber?: string;
  plate?: string;
  cardValue?: number;
  cardCant?: number;
  cashValue?: number;
  cashCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  qrValue?: number;
  qrCant?: number;
  totalCant?: number;
}

export interface TravelCollectsClearingPassages {
  travelId?: number;
  date?: string;
  cardValue?: number;
  cardCant?: number;
  cashValue?: number;
  cashCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  qrValue?: number;
  qrCant?: number;
  totalCant?: number;
}

export interface InfoPassenger {
  id?: number;
  identification?: string;
  account?: string;
  name?: string;
  paymentType?: string;
  value?: number;
  hadDiscount?: boolean;
  discountValue?: string;
  isTransfer?: boolean;
}

export interface ClearingDetailsData {
  details?: DetailsClearingPassages[];
  periodSelected?: number;
  detailsSelected?: DetailsClearingPassages;
  routesDetail?: RoutesDetailsClearingPassages[];
  routesDetailSelected?: RoutesDetailsClearingPassages;
  vehiclesDetail?: VehicleDetailsClearingPassages[];
  vehicleDetailSelected?: VehicleDetailsClearingPassages;
  travelsDetail?: TravelDetailsClearingPassages[];
  travelDetailSelected?: TravelDetailsClearingPassages;
  passenger?: InfoPassenger[];
  detailsShower?: DetailsClearingPassages[];
  routesShower?: RoutesDetailsClearingPassages[];
  travelsShower?: TravelDetailsClearingPassages[];
  vehiclesShower?: VehicleDetailsClearingPassages[];
}

export interface DetailsClearingPassages {
  date?: string;
  collectValue?: number;
  collectCant?: number;
  transferValue?: number;
  transferCant?: number;
  discountPayedValue?: number;
  discountPayedCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  totalCant?: number;
}

export interface RoutesDetailsClearingPassages {
  date?: string;
  routeId?: number;
  routeName?: string;
  collectValue?: number;
  collectCant?: number;
  transferValue?: number;
  transferCant?: number;
  discountPayedValue?: number;
  discountPayedCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  totalCant?: number;
}

export interface VehicleDetailsClearingPassages {
  date?: string;
  vehicleId?: string;
  internalNumber?: string;
  plate?: string;
  collectValue?: number;
  collectCant?: number;
  transferValue?: number;
  transferCant?: number;
  discountPayedValue?: number;
  discountPayedCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  totalCant?: number;
}

export interface TravelDetailsClearingPassages {
  travelId?: number;
  date?: string;
  collectValue?: number;
  collectCant?: number;
  transferValue?: number;
  transferCant?: number;
  discountPayedValue?: number;
  discountPayedCant?: number;
  discountValue?: number;
  totalCollected?: number;
  distributionTotal?: number;
  weekNumber?: number;
  totalCant?: number;
}

export interface RechargeDataSend {
  companyId?: number;
  state?: any;
  startDate?: string;
  endDate?: string;
  recharge?: ClearingRechargeDetails;
  configId?: any;
}

export interface PassageDataSend {
  companyId?: number;
  state?: any;
  startDate?: string;
  endDate?: string;
  ticket?: any;
  configId?: any;
}
