import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from './localstorage.service';
import { WebService } from './web.service';

@Component({
  selector: 'Stock',
  templateUrl: './stock.component.html',
})
export class StockComponent {

  constructor(public webService: WebService, public localStorageService : LocalStorageService, private route: ActivatedRoute) {}

  ngOnInit () {
    let symbol = this.route.snapshot.params.symbol;
    this.webService.getStockDetail(symbol);
  }

  switchTab(obj){
    console.log(obj);
  }
  gotoFav(){
    (<any>$('#favlisttab')).tab('show');
  }
}
