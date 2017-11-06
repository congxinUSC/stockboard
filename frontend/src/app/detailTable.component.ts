import { Component } from '@angular/core';
import { WebService } from './web.service';
import * as $ from 'jquery';

// TODO: timezone problem

@Component({
  selector: 'DetailTab',
  templateUrl: './detailTable.component.html',
  styleUrls: ['./detailTable.component.css']
})
export class DetailTableComponent {

  constructor(public webService : WebService) {}

  info;

  ngOnInit () {
    this.webService.stockInfoTab.subscribe((ret)=>{
      this.info = ret;
    });
  }
}
