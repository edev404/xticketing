export interface Card{
    id:number
    number?:string
    balance?:number
    account?:string
    active?:boolean
    blocked?:boolean
    card_type?: string;
    init_request_date?: string;
    activation_date?:string;
    unsubscribed?:boolean
    id_passenger?:number
}