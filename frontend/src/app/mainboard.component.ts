import { Component } from '@angular/core';
import { LocalStorageService } from './localstorage.service';
declare var $ :any;

@Component({
  selector: 'mainboard',
  templateUrl: './mainboard.component.html',
  styles: ['.tab-content .tab-pane {position: relative;}',
    '::ng-deep .mat-tab-group .mat-tab-header { display: none; }']
})
export class MainboardComponent{
  constructor(public localStorageService: LocalStorageService){}
}

