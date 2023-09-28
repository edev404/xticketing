import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexXAxis, ApexGrid, ApexLegend, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive } from "ng-apexcharts";

export interface Recargas {
    fecha: string;
    hora: string;
    empresa: string;
    sucursal: string;
    latitud: string;
    longitud: string;
    estado: string;
    tipo_recarga: string;
    max_monto_recarga_x_dia: number;
    min_monto_recarga_x_dia: number;
    nro_recargas: number;
    total_recargas: number;
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
  
  export type ChartOptions2 = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    title: ApexTitleSubtitle;
  };
  
  export type ChartOptions3 = {
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