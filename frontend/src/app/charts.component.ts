import { Component } from '@angular/core';
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';
import * as Highcharts from 'highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting';

HighchartsExporting(Highcharts);


@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
})
export class ChartsComponent {

  constructor(public webService : WebService, public localStorageService : LocalStorageService) {}

  status;
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

    this.webService.requestStatus.subscribe((obj)=>{
        this.status=obj;
      });
  }

  // setTimeout(func, 0) to make sure this happens after angular render the target div
  private plotPV(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartPV',obj);
    }, 0);
  }
  private plotSMA(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartSMA',obj);
    }, 0);
  }
  private plotEMA(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartEMA',obj);
    }, 0);
  }
  private plotSTOCH(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartSTOCH',obj);
    }, 0);
  }
  private plotRSI(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartRSI',obj);
    }, 0);
  }
  private plotADX(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartADX',obj);
    }, 0);
  }
  private plotCCI(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartCCI',obj);
    }, 0);
  }
  private plotBBANDS(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartBBANDS',obj);
    }, 0);
  }
  private plotMACD(obj) {
    setTimeout(()=>{
      Highcharts.chart('chartMACD',obj);
    }, 0);
  }

  switchTab(event) {
    this.localStorageService.setSelected(event.target.innerText);
  }
}
