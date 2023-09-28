interface cardsDashboards {
    total: number;
    evento: string;
}
export interface CardsDashboard {
    status?: string;
    data: cardsDashboards[];
}