export interface IEntidadesByUser {
    id?: number;
    user?: number;
    entities?: any;
    services?: IElementsByUser[];
    companies?: any;
    default_entity?: number;
    entitiesName?: string[];
    servicesName?: string[];
    companiesName?: string[];
};

export interface IElementsByUser {
    id?: number;
    name?: string;
    code?: string;
    active?: boolean;
}
