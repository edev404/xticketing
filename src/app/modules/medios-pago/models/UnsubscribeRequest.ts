import { Card } from "./Card";

export interface UnsubscribeRequest{
    cards?:Card[]
    id_unsubscribe_reason?:number
    comment?:string
}