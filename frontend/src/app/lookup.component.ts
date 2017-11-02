import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'lookup',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="e.g. AAPL" aria-lagle="Stock" [matAutocomplete]="auto" 
               [formControl]="inputControl" [ngModel]="symbol" (ngModelChange)="valueChange($event)"
               name="symbol" formControlName="symbol"/>
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option *ngFor="let stock of webService.symbolList | async" [value]="stock.Symbol">
            {{stock.Symbol}}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
      <button mat-raised-button [disabled]="!form.valid">Search</button>
    </form>
  `,
})
export class LookupComponent {
  form;
  symbol = '';
  inputControl = new FormControl();

  constructor(private webService : WebService, private fb : FormBuilder) {
    this.form = fb.group ({
      symbol: ['', Validators.required]
    }, { validator: (this.symbol)});
  }

  timeoutHandle;
  valueChange(newValue){
    if(this.symbol === newValue) return;
    this.symbol=newValue;
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      this.get();
      //console.log(this.symbol);
    }, 500);
    //this.get();
  }

  isValid (control) {
    return this.form.controls[control].invalid && this.form.controls[control].touched;
  }

  onSubmit () {
    this.webService.getStockBrief(this.symbol);
  }

  get(){
    this.webService.getSymbolList(this.symbol);
  }
}
