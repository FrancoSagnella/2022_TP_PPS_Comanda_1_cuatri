import { Injectable } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  constructor() { }
  crearGraficoBarras(param1:any, param2:any, titulo:string, xAxisTitle:string, yAxisTitle:string, sufijo:string)
  {
    return new Chart({
      chart:{
        type:'pie',
        backgroundColor: {
          linearGradient: { x1: 2, x2: 1, y1: 0, y2: 2 },
          stops: [
              [0, 'rgb(246, 109, 15)'],
              [1, 'rgb(188, 180, 12)']
          ]
      },
      },
      title:{
        text:titulo
      },
      xAxis:{
        categories:param1,
        title:{
          text:xAxisTitle
        }
      },
      yAxis:{
        min:0,
        title:{
          text:yAxisTitle,
          align:'high'
        },
        labels:{
          overflow:'justify'
        }
      },
      tooltip: {
        valueSuffix: ' '+sufijo
      },
      plotOptions: {
          pie: {
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>votos: {point.y}',

              },
              allowPointSelect: true,
              showInLegend: true,
              cursor: 'pointer',

          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          shadow: true
      },
      credits: {
          enabled: false
      },
      series: [
        {
          type:'pie',
          name: 'votos',

          data: param2,
          slicedOffset:20
         }
      ]
    });
  }
}
