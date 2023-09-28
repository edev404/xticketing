export interface IEntitiesConfiguration {
    id?: number;
    active?: boolean;
    code?: number;
    name?: string;
    description?: string;
    messageInstitutional?: string;
    mail?: string;
    phone?: string;
    direction?: string;
    location?: ILocation;
    webSite?: string;
    logo?: string;
    style?: string;
    stocktarjetas?: number;
  }
  
  export interface IgeographicalAreas {
    id?: number,
    nombre?: string,
  }
  
  export interface LocationBasic {
    countryId?: string,
    deparmentId?: string,
    cityId?: string
  }
  
  export interface ICity {
    id?: string;
    code?: string;
    name?: string;
    departmentId?: string;
  }
  
  export interface IDepartment {
    id?: string;
    code?: string;
    name?: string;
    countryId?: string;
  }
  
  export interface ICountry {
    id?: string;
    code?: string;
    name?: string;
  }
  
  export interface ILocation {
    country: ICountry;
    department: IDepartment;
    city: ICity;
  }
  
  export interface IServicesCompanyToEntity {
    id?: number;
    idEntity?: number;
    idServices?: any;
    idCompanies?: string;
    account?: number;
    nameEntity?: string;
    dateServices?: any;
    namesServices?: string;
    dateCompanies?: any;
    namesCompanies?: string;
  }
  
  export interface IRelationServices {
    account?: number;
    servicesItemSelected?: any[];
    companyItemSelected?: any[];
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