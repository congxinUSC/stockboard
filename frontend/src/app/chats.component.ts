import { Component } from '@angular/core';
import { WebService } from './web.service';
import Highcharts from 'highcharts';
@Component({
  selector: 'charts',
  template: `
    <mat-tab-group>
      <mat-tab label="Price">
        <div id="containerPV">1</div>
      </mat-tab>
      <mat-tab label="SMA">
        <div id="containerSMA">2</div>
      </mat-tab>
      <mat-tab label="EMA">
        <div id="containerEMA">3</div>
      </mat-tab>
      <mat-tab label="STOCH">
        <div id="containerSTOCH">4</div>
      </mat-tab>
      <mat-tab label="RSI">
        <div id="containerRSI">5</div>
      </mat-tab>
      <mat-tab label="ADX">
        <div id="containerADX">6</div>
      </mat-tab>
      <mat-tab label="CCI">
        <div id="containerCCI">7</div>
      </mat-tab>
      <mat-tab label="BBANDS">
        <div id="containerBBANDS">8</div>
      </mat-tab>
      <mat-tab label="MACD">
        <div id="containerMACD">9</div>
      </mat-tab>
    </mat-tab-group>
    <button (click)="post()" mat-button color="primary">POST</button>
  `
})
export class ChatsComponent {

  constructor(public webService : WebService) {}

  ngOnInit () {
    this.webService.stockPV.subscribe(this.plotPV);
    // this.webService.stockSMA.subscribe(this.plotSMA);
    // this.webService.stockEMA.subscribe(this.plotEMA);
    // this.webService.stockSTOCH.subscribe(this.plotSTOCH);
    this.webService.stockRSI.subscribe(this.plotRSI);
    this.webService.stockADX.subscribe(this.plotADX);
    // this.webService.stockCCI.subscribe(this.plotCCI);
    // this.webService.stockBBANDS.subscribe(this.plotBBANDS);
    this.webService.stockMACD.subscribe(this.plotMACD);

  }

  private plotPV(obj) {
    console.log(obj);
    Highcharts.chart('containerPV',obj)
  }
  private plotSMA(obj) {
    Highcharts.chart('containerSMA',obj)
  }
  private plotEMA(obj) {
    Highcharts.chart('containerEMA',obj)
  }
  private plotSTOCH(obj) {
    Highcharts.chart('containerSTOCH',obj)
  }
  private plotRSI(obj) {
    Highcharts.chart('containerRSI',obj)
  }
  private plotADX(obj) {
    Highcharts.chart('containerADX',obj)
  }
  private plotCCI(obj) {
    Highcharts.chart('containerCCI',obj)
  }
  private plotBBANDS(obj) {
    Highcharts.chart('containerBBANDS',obj)
  }
  private plotMACD(obj) {
    Highcharts.chart('containerMACD',obj)
  }

  // TODO: make the process async
  post() {
    this.webService.getStockDetail('AAPL');
  }
}
