export interface Company {
  id?: any;
  code?: any;
  name?: any;
  state?: any;
  serverHost?: any;
  client: Client;
  typeId?: any;
  minQuantityCardByLot?: any;
  maxQuantityCardByLot?: any;
  maxAmountByDay?: any,
  minAmountByDay?: any,
  tope_dinero?:any,
  maxTransactionByDay?: any
}

export interface Client {
  id?:any,
  nit?:any,
  address?:any,
  cityId?:any,
  email?:any,
  managerName?:any,
  managerLastName?:any,
  managerCellPhone?:any,
  city?:any
}

export interface ICompany {
  id?: any;
  code?: any;
  name?: any;
  state?: boolean;
  active?: any;
  serverHost?: any;
  typeId?: any;
  minQuantityCardByLot?: any;
  maxQuantityCardByLot?: any;
  client?: ICLient;
}

export interface ICLient {
  id?: any;
  nit?: any;
  address?: any;
  cityId?: any;
  email?: any;
  managerName?: any;
  managerLastName?: any;
  managerCellPhone?: any;
  city?: any;
}

export interface TypeCompany {
  id?: number;
  description: string;
}
