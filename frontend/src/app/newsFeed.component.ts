import { Component, OnInit } from '@angular/core';
import { WebService } from './web.service';

@Component({
  selector: 'NewsFeed',
  templateUrl: './newsFeed.component.html',
})
export class NewsFeedComponent implements OnInit{

  constructor(public webService : WebService) {}

  newsobj;

  ngOnInit () {
    this.webService.stocknews.subscribe((obj) =>{
      this.newsobj=obj;
    });
  }
}
