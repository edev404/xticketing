export class ManageService {
    id?: number;
    active?: boolean;
    code!: number;
    name!: string;
    description!: string;
    type_company!: string;
    name_company?: string;
    options!: string;
}

export class typeCompany {
    id!: number;
    description!: string;
}