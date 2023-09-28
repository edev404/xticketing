export interface DistributionRequest{
    collectionCompany?:number
    date?:Date
    batches?:{initializationBatch:number,cards:number}[]
    id_entity?:number
}