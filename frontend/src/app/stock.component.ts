import { Component } from '@angular/core';
import { LocalStorageService } from './localstorage.service';

@Component({
  selector: 'Stock',
  templateUrl: './stock.component.html',
})
export class StockComponent {

  constructor(public localStorageService : LocalStorageService) {}

  switchTab(obj){
    console.log(obj);
  }
}
