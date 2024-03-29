import { Component } from '@angular/core';
import { LocalStorageService } from './localstorage.service';
import { WebService } from './web.service';

@Component({
  selector: 'Stock',
  templateUrl: './stock.component.html',
})
export class StockComponent {

  constructor(public webService: WebService, public localStorageService : LocalStorageService) {}

  switchTab(event){
    this.localStorageService.setSubView(event.target.id);
  }
  gotoFav(){
    this.localStorageService.currentView=0;
  }
}
