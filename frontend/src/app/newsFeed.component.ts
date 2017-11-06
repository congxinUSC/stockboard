import { Component } from '@angular/core';
import { WebService } from './web.service';

@Component({
  selector: 'NewsFeed',
  templateUrl: './newsFeed.component.html',
})
export class NewsFeedComponent {

  constructor(public webService : WebService) {}

  newsobj;

  ngOnInit () {
    this.webService.stocknews.subscribe((obj) =>{
      this.newsobj=obj;
    });
  }
}
