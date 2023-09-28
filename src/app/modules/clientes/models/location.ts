export class Location {
    constructor(public country: Country, public department: Department, public city: City) {
  
    }
  
    public getStringData(): string {
  
      return (this.country.name ? this.country.name + ', ' : ' ') +
        (this.department.name ? this.department.name + ', ' : ' ') +
        (this.city.name ? this.city.name : ' ');
    }
  }
  
  export class Country {
    constructor(public id: string, public code, public name) {
    }
  }
  
  export class Department {
    constructor(public id: string, public code, public name, public countryId) {
    }
  }
  
  export class City {
    constructor(public id: string, public code, public name, public departmentId) {
    }
  }
  
  export class ICity {
    id?: string | null;
    code?: string;
    name?: string;
    departmentId?: string;
  }
  
  export class IDepartment {
    id?: string | null;
    code?: string;
    name?: string;
    countryId?: string;
  }
  
  export class ICountry {
    id?: string | null;
    code?: string;
    name?: string;
  }
  
  export class ILocation {
    country: ICountry = new ICountry;
    department: IDepartment = new IDepartment ;
    city: ICity = new ICity;
  }
  