import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexTitleSubtitle } from "ng-apexcharts";

export interface Viajes {
    fecha: string;
    id_empresa: number;
    empresa: string;
    id_viaje: number;
    deuda: number;
    id_ruta: number;
    nombre_ruta: string;
    id_vehiculo: string;
    conductor: string;
    estado_viaje: string;
    medio_pago: string;
    tipo_pago: string;
    numero_pasajeros: number;
    total_pagado: number;
}

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    title: ApexTitleSubtitle;
  };