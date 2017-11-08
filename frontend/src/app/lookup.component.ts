import { Component } from '@angular/core';
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html',
})
export class LookupComponent {
  form;
  symbol = '';
  timeoutHandle;

  constructor(private webService : WebService,private localStorageService:LocalStorageService, private fb : FormBuilder) {
    this.form = fb.group ({
      symbol: ['', Validators.required]
    });
  }

  valueChange(newValue){
    newValue=newValue.toUpperCase().trim();
    if(this.symbol === newValue) return;
    this.symbol=newValue;
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      this.get();
    }, 500);
  }

  isValid () {
    return this.symbol.length>0 || !this.form.controls['symbol'].touched;
  }

  onSubmit () {
    this.webService.getStockDetail(this.symbol);
    this.localStorageService.currentView=1;
  }

  get(){
    this.webService.getSymbolList(this.symbol);
  }

  clear(){
    this.form.controls['symbol'].reset('',Validators.required);
    this.webService.clearResult();
    this.localStorageService.currentView=0;
  }
}
