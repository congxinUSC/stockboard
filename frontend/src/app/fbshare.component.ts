import { Component } from '@angular/core'
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

@Component({
  selector: 'fb-share',
  template: `
      <button (click)="share()" [disabled]="'OK' !== chartStatus[selection]" class="btn btn-default" type="button">
        <i class="fa fa-facebook-square" style="font-size:100%; color:#3B5998"></i>
      </button>
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

  share(){
    // console.log(this.selection);
    // console.log(this.chartStatus);
    this.webService.fbshare(this.selection);
  }
}
