import { Component } from '@angular/core';
import { WebService } from './web.service';


@Component({
  selector: 'DetailTab',
  templateUrl: './detailTable.component.html',
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
