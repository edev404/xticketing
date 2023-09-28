import {ILocation, Location} from './location';

export class Passenger {
  constructor(public id: number,
              public cardId: number,
              public card,
              public firstName,
              public secondName,
              public lastName,
              public secondLastName,
              public identificationTypeId: number,
              public identificationType,
              public identification,
              public account,
              public company,
              public bornDate,
              public age,
              public cellPhone,
              public email,
              public bornLocation: Location,
              public residenceLocation: Location,
              public address,
              public occupationId: number,
              public occupation,
              public genderId: number,
              public gender,
              public maritalStateId: number,
              public maritalState,
              public active) {

  }
}

export class IPassenger {
  id?: number;
  cardId?: number;
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
  bornLocation?: ILocation = new ILocation;
  residenceLocation?: ILocation = new ILocation;
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
  codePhone?;
  phone?;
  type?;
  idStateAccount?;
  idSavings?;
  idClientExternal?;
  genderCode?;
  userCreator?;
}
