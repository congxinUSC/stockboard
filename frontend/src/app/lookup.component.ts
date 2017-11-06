import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators } from '@angular/forms';

// TODO: form validation, deal with style, clear button

@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html',
  styles: ['.error{border-color:#FF0000}']
})
export class LookupComponent {
  form;
  symbol = '';
  timeoutHandle;

  constructor(private webService : WebService, private fb : FormBuilder) {
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
    (<any>$('#detailtab')).tab('show');
  }

  get(){
    this.webService.getSymbolList(this.symbol);
  }

  clear(){
    this.form.controls['symbol'].reset('',Validators.required);
  }
}
