export interface TypeActor {
    id?: number;
    code?: string;
    name?: string;
    responsableName?: string;
    responsableCellphone?: string;
    responsableEmail?: string;
    active?: boolean;
    typeCompanyId?: number;
}

export interface Recharge {
    id?: number;
    code?: string;
    name?: string;
    cityId?: number;
    cityName?: string;
    creationDate?: string;
    creationUser?: string;
    rechargeCollectors?: RechargeInvolved[];
    active?: boolean;
  }
  
export interface RechargeInvolved {
    status?:boolean;
    rechargeId?: number;
    collectorId?: number;
    collectorName?: string;
    percentage?: number;
    validityStartDate?: string | null;
    validityEndDate?: string | null;
}

export interface PassagesConfiguration {
    id?: number;
    code?: string;
    name?: string;
    cityId?: number;
    cityName?: string;
    validityStartDate?: string;
    validityEndDate?: string;
    creationDate?: string;
    creationUser?: string;
    active?: boolean;
    ticketInvolveds?: TicketInvolved[];
  }
  
  export interface TicketInvolved {
    ticketId?: number;
    involvedId?: number;
    percentage?: number;
    involvedName?: string;
  }
  
  export interface PassagesTransferConfiguration {
    ticketId?: number;
    transferId?: number;
    sourceRoute?: RouteTransferConfiguration;
    destinationRoute?: RouteTransferConfiguration;
    validityStartDate?: string;
    validityEndDate?: string;
  }
  
  export interface RouteTransferConfiguration {
    id?: number;
    name?: string;
    percentage?: number;
    companyId?: number;
    companyName?: string;
  }
  