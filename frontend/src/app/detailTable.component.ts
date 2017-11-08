import { Component, OnInit } from '@angular/core';
import { WebService } from './web.service';

// TODO: timezone problem

@Component({
  selector: 'DetailTab',
  templateUrl: './detailTable.component.html',
  styleUrls: ['./detailTable.component.css']
})
export class DetailTableComponent implements OnInit{

  constructor(public webService : WebService) {}

  info;

  ngOnInit () {
    this.webService.stockInfoTab.subscribe((ret)=>{
      this.info = ret;
    });
  }
}
