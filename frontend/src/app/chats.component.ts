import { Component } from '@angular/core';
import { WebService } from './web.service';
import Highcharts from 'highcharts';

@Component({
  selector: 'charts',
  template: `
    <mat-tab-group>
      <mat-tab label="Price"><div id="PriceChart"></div></mat-tab>
      <mat-tab label="SMA">Content 2</mat-tab>
      <mat-tab label="EMA">Content 2</mat-tab>
      <mat-tab label="STOCH">Content 2</mat-tab>
      <mat-tab label="RSI">Content 2</mat-tab>
      <mat-tab label="ADX">Content 2</mat-tab>
      <mat-tab label="CCI">Content 2</mat-tab>
      <mat-tab label="BBANDS">Content 2</mat-tab>
      <mat-tab label="MACD">Content 2</mat-tab>
    </mat-tab-group>
    <button (click)="post()" mat-button color="primary">POST</button>
  `
})
export class ChatsComponent {

  constructor(public webService : WebService) {}

  ngOnInit () {
    this.webService.getStockDetail('AAPL');
  }
  // TODO: make the process async
  post() {
    Highcharts.chart('PriceChart', this.webService.stockDetailStore.PV);
  }
}
