import { Component } from '@angular/core';
import {WebService} from './web.service';

@Component({
  selector: 'home',
  template: `
    <new-message></new-message>
    <messages></messages>
    <lookup></lookup>
    <favlist></favlist>
    <button (click)="post()" mat-button color="primary">POST</button>
    <Stock></Stock>
  `
  ,
})
export class HomeComponent {

  constructor(public webService:WebService){}
  // TODO: make the process async
  post() {
    this.webService.getStockDetail('AAPL');
  }
}
