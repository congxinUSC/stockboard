import { Component } from '@angular/core';
import { WebService } from './web.service';


@Component({
  selector: 'NewsFeed',
  templateUrl: './newsFeed.component.html',
})
export class NewsFeedComponent {

  constructor(public webService : WebService) {}

  // TODO: make the process async
  post() {
    this.webService.getStockDetail('AAPL');
    this.webService.stocknews.subscribe(n=>console.log(n));
  }
}
