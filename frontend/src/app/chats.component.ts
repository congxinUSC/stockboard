import { Component } from '@angular/core';
import { WebService } from './web.service';
import * as Highcharts from 'highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting';

HighchartsExporting(Highcharts);

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
})
export class ChatsComponent {

  constructor(public webService : WebService) {}

  ngOnInit () {
    this.webService.stockPV.subscribe(this.plotPV);
    this.webService.stockSMA.subscribe(this.plotSMA);
    this.webService.stockEMA.subscribe(this.plotEMA);
    this.webService.stockSTOCH.subscribe(this.plotSTOCH);
    this.webService.stockRSI.subscribe(this.plotRSI);
    this.webService.stockADX.subscribe(this.plotADX);
    this.webService.stockCCI.subscribe(this.plotCCI);
    this.webService.stockBBANDS.subscribe(this.plotBBANDS);
    this.webService.stockMACD.subscribe(this.plotMACD);

  }

  private plotPV(obj) {
    Highcharts.chart('chartPV',obj)
  }
  private plotSMA(obj) {
    Highcharts.chart('chartSMA',obj)
  }
  private plotEMA(obj) {
    Highcharts.chart('chartEMA',obj)
  }
  private plotSTOCH(obj) {
    Highcharts.chart('chartSTOCH',obj)
  }
  private plotRSI(obj) {
    Highcharts.chart('chartRSI',obj)
  }
  private plotADX(obj) {
    Highcharts.chart('chartADX',obj)
  }
  private plotCCI(obj) {
    Highcharts.chart('chartCCI',obj)
  }
  private plotBBANDS(obj) {
    Highcharts.chart('chartBBANDS',obj)
  }
  private plotMACD(obj) {
    Highcharts.chart('chartMACD',obj)
  }

  // TODO: make the process async
  post() {
    this.webService.getStockDetail('GOOG');
  }
}
