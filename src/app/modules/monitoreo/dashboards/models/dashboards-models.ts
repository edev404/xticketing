import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexPlotOptions, ApexLegend, ApexNonAxisChartSeries, ApexResponsive, ApexYAxis } from "ng-apexcharts";

export interface Dashboards {
    fecha: string;
    hora: string;
    nombre_empresa: string;
    nombre_ruta: string;
    id_empresa: number;
    id_ruta: number;
    nro_pasajeros: number;
    recaudado: number;
    tipo_pago: number;
}

export interface Subidas {
    codigo: string;
    empresa: string;
    id_ruta: number;
    ruta: string;
    fecha: string;
    idprogramacion: number;
    bajada_1: number;
    bajada_2: number;
    subida_1: number;
    subida_2: number;
    bloqueo_1: number;
    bloqueo_2: number;
}


export type ChartOptions3 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    colors: string[];
};

export type ChartOptions2 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    annotations: any; //ApexAnnotations;
    grid: ApexGrid;
    yaxis: any; // ApexYAxis;
    colors: string[];
    title: ApexTitleSubtitle;
    legend: ApexLegend;
};

export type ChartOptions4 = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    grid: ApexGrid;
};

type ApexXAxis = {
    type?: "category" | "datetime" | "numeric";
    categories?: any;
    labels?: {
        style?: {
            colors?: string | string[];
            fontSize?: string;
        };
    };
};

export interface DataEntry {
    fecha: string;
    hora: string;
    nro_pasajeros: number;
}



export interface IntervalData {
    intervalo: string;
    total_pasajeros: number;
}

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    colors: string[];
    legend: ApexLegend;
    title: ApexTitleSubtitle;
};