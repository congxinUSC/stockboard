import { Component, OnInit } from '@angular/core';
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';
import * as Highcharts from 'highcharts/highstock'
import * as HighchartsExporting from 'highcharts/modules/exporting';

HighchartsExporting(Highcharts);

@Component({
  selector: 'histChart',
  templateUrl: './histChart.component.html',
})
export class HistChartComponent implements OnInit{

  constructor(public webService : WebService, public localStorageService: LocalStorageService) {}

  ngOnInit () {
    this.webService.stockHist.subscribe(this.plotHist);
    this.localStorageService.currentSubView.subscribe(this.reflow);
  }

  private plotHist(obj) {
    setTimeout(()=>{
      Highcharts.stockChart('chartHist',obj);
    }, 0);
  }

  private reflow(sel) {
    if(sel!=='Historical_chart_sel') return;
    setTimeout(()=>{
      if(Highcharts.charts[0])
        Highcharts.charts[0].reflow();
    },0);
  }
}
