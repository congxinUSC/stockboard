import { Component } from '@angular/core';
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

// TODO: sorting favList. right button color, error handling

@Component({
  selector: 'favlist',
  templateUrl: './favlist.component.html',
  styleUrls: ['./favlist.component.css']
})
export class FavListComponent {

  raise_arrow_src='http://cs-server.usc.edu:45678/hw/hw8/images/Up.png';
  fall_arrow_src='http://cs-server.usc.edu:45678/hw/hw8/images/Down.png';

  order='Ascending';
  sortBy='Default';

  favSymbolList=[];

  favList=[];

  isAutoRefresh = false;

  intervalHandler;

  constructor(private webService : WebService, private localStorageService : LocalStorageService) {}
  ngOnInit(){

    this.localStorageService.favList.subscribe((arr)=>{
      this.favSymbolList=arr;
      this.refresh();

      this.favList=this.favList
        .filter(value => {
          return this.favSymbolList.indexOf(value[0]) !== -1;})
        .map(value=>{
          return value[1];
        });
    });

    this.webService.stockBrief.subscribe((arr)=>{
      this.favList=arr
        .filter(value => {
        return this.favSymbolList.indexOf(value[0]) !== -1;})
        .map(value=>{
          return value[1];
        });
    });

    (<any>$('input[type=checkbox]')).bootstrapToggle();
    $('input[type=checkbox]').change((event)=>{
      this.toggleValueChanged((<HTMLInputElement>(event.target)).checked);
    });

    // $('select>option:eq(0)').prop('selected', true);
  }

  toggleValueChanged(val:boolean){
    console.log(val);
    this.isAutoRefresh=val;
    if(val) {
      this.intervalHandler = setInterval(()=>{this.refresh()},5000);
    } else {
      clearInterval(this.intervalHandler);
    }
  }

  comparergen(key, order) {
    return order==='Ascending'?
      (a,b)=>{
        if(a[key]>b[key]) return 1;
        else if(a[key]<b[key]) return -1;
        else return 0;
      }:
      (b,a)=>{
        if(a[key]>b[key]) return 1;
        else if(a[key]<b[key]) return -1;
        else return 0;
      }
  }

  refresh () {
    if(!(this.favSymbolList)) return;
    this.favSymbolList.forEach((symbol)=>{
      this.webService.getStockBrief(symbol);
    });
  }

  gotoDetail(){
    (<any>$('#detailtab')).tab('show');
  }

  onSubmit (symbol) {
    this.webService.getStockDetail(symbol);
    (<any>$('#detailtab')).tab('show');
  }

  unlike (symbol) {
    if((!symbol)) return;
    let i=this.localStorageService.checkFavList(symbol);
    if (-1 !== i) this.localStorageService.deleteFavItem(symbol);
  }
}
