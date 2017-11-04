import { Component } from '@angular/core'
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

@Component({
  selector: 'fb-share',
  template: `
    <!--<button (click)="show()" mat-button [disabled]="'Price' !== selection" color="primary">test</button>-->
    <!--<button (click)="show()" mat-button [disabled]="null === chartStatus" color="primary">test</button>-->
    <button (click)="show()" mat-button [disabled]="'OK' !== chartStatus[selection]" color="primary">test</button>
    <!--<button (click)="show()" mat-button color="primary">test</button>-->
  `,
})

export class FbshareComponent {

  selection = 'Price';
  chartStatus = {
    Price: 'loading',
    SMA: 'loading',
    EMA: 'loading',
    RSI: 'loading',
    ADX: 'loading',
    CCI: 'loading',
    BBANDS: 'loading',
    STOCH: 'loading',
    MACD: 'loading',
    news: 'loading'
  };
  constructor(public webService: WebService, public localStorageService: LocalStorageService) {}

  ngOnInit(){
    this.localStorageService.selected.subscribe((str)=>{
      this.selection = str.toString();
    });
    this.webService.requestStatus.subscribe((obj)=>{
      this.chartStatus = obj;
    });
  }


  show(){
    console.log(this.selection);
    console.log(this.chartStatus);
    // this.charts.webService.fbshare(this.charts.selected);
  }
}
