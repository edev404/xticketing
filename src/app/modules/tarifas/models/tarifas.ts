export class Tarifas {
        id: number | undefined;
        idServices: number | undefined;
        idEntity: number | undefined;
        company: number | undefined;
        validityInitial: string | undefined;
        validityEnd: string | undefined;
        type: string | undefined;
        unity: string | undefined;
        description: string | undefined;
        code: string | undefined;
        status: boolean | undefined;
        nameServices: string | undefined;
        nameEntity: string | undefined;
        nameCompany: string | undefined;
        characteristicFirst: string | undefined;
        characteristicSecond: string | undefined;
  }

  export class RateDetailModel {
    id?: number;
    id_rates?: number;
    zoneInitial?: string;
    zoneInitialId?: number;
    zoneFinal?: string;
    zoneFinalId?: number;
    rute?: any;
    ruteId?: number;
    featuresOne?: string;
    featuresOneId?: number;
    featuresTwo?: string;
    featuresTwoId?: number;
    dias?: number[];
    horaria_desde?: string | null;
    horaria_hasta?: string | null;
    activa?: boolean;
    status?: boolean;
    rango_ini?: number;
    rango_end?: number;
    tarifa?: number;
    
}


  export class  ServicesRateModel {
      id?: number;
      nameServices: string | undefined;
      idEntity: number | undefined;
      idServices: number | undefined;
      nameCompany: string | undefined;
      company: number | undefined;
      code: string | undefined;
      description: string | undefined;
      validityInitial: Date | string | null | undefined;
      validityEnd: Date | string | null | undefined;
      type: string | undefined;
      typeId: number | undefined;
      unity: string | null | undefined;
      unitId: number | undefined;
      characteristicFirst?: string;
      characteristicFirstId?: number;
      characteristicSecond?: string;
      characteristicSecondId?: number;
      status: boolean = true ;
  }