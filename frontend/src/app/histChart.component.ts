import { Component } from '@angular/core';
import { WebService } from './web.service';
import * as Highcharts from 'highcharts/highstock'
import * as HighchartsExporting from 'highcharts/modules/exporting';

HighchartsExporting(Highcharts);

@Component({
  selector: 'histChart',
  templateUrl: './histChart.component.html',
})
export class HistChartComponent {

  constructor(public webService : WebService) {}

  ngOnInit () {
    this.webService.stockHist.subscribe(this.plotHist);
  }

  private plotHist(obj) {
    setTimeout(()=>{
      Highcharts.stockChart('chartHist',obj);
    }, 0);
  }
}
