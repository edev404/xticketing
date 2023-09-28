import { Provider } from "@angular/core";
import { CardClass } from "./CardClass";

export interface Registry{
    id?:number;
    soc?:number;
    idprovider?:number;
    provider_name?:string
    idcardclass?:number;
    cardclass?:CardClass | any;
    active?:boolean;
    provider?: string; 
    purchasedate?:string;
    inventorydate?:string;
    quantity?:number;
    available_cards?:number
}