import { InitUser } from "./InitUser";

export interface InitializationRequest{
    id?:number
    requested_quantity?:number
    initialized_quantity?:number
    active?:boolean
    assigned_user?:string
    cardTypeId?:number
    creation_date?:string
    id_mapping?:number
    codigoLote?:any
    status?:string
    id_cancellation_reason?:string
    cancellation_comment?:string
    initUser?:InitUser
    available_quantity:number
}