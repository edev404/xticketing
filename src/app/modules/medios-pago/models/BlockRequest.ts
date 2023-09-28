import { Card } from "./Card";

export interface BlockRequest{
    cards?:Card[]
    id_block_reason?:number
    comment?:string
}