import { Reason } from "./Reason";

export interface RegistryDetail{
    id?:number;
    id_registry?:number;
    id_reason?:number;
    observation?:string;
    quantity?:number;
    user?:string;
    date?:string;
    reason?:Reason;
}