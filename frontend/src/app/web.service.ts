import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';

@Injectable()


export class WebService {

  BASE_URL = 'http://localhost:4201/api';

  private messagesStore = [];
  private messageSubject = new Subject();
  messages = this.messageSubject.asObservable();

  // Object which has a single array element that stores the list
  private symbolListStore = null;
  private symbolListSubject = new Subject();
  symbolList = this.symbolListSubject.asObservable();

  // The array that stores stock brief info in the favorite list
  private stockBriefStore = [];
  private stockBriefSubject = new Subject();
  stockBrief = this.stockBriefSubject.asObservable();

  // The object that stores the entire set of detailed info of the stock
  // Should contain data for all the points in the chart and news
  private stockDetailStore = {
    PV: null,
    SMA: null,
    EMA: null,
    RSI: null,
    ADX: null,
    CCI: null,
    BBANDS: null,
    STOCH: null,
    news: null
  };
  private stockDetailSubject = new Subject();
  stockDetail = this.stockDetailSubject.asObservable();

  constructor (private http: Http) {}

  getMessages (user) {
    user = (user) ? '/' + user : '';
    this.http.get(this.BASE_URL + '/messages' + user).subscribe(response => {
      this.messagesStore = response.json();
      this.messageSubject.next(this.messagesStore);
    }, this.handleError);
  }

  postMessage (message) {
    this.http.post(this.BASE_URL + '/messages', message).subscribe(response => {
      this.messagesStore.push(response.json());
      this.messageSubject.next(this.messagesStore);
    }, this.handleError);
  }

  getSymbolList (short) {
    short = (short) ? '/' + short : '';
    if(!(short)) return;
    this.http.get(this.BASE_URL + '/lookup' + short).subscribe(response => {
      // update the symbol list
      this.symbolListStore = response.json();
      this.symbolListSubject.next(this.symbolListStore);
    }, this.handleError);
  }

  getStockBrief (symbol) {
    symbol = (symbol) ? '/' + symbol : '';
    if(!(symbol)) return;
    this.http.get(this.BASE_URL + '/short' + symbol).subscribe( response => {
      // update the brief stock information by pushing the new one in to the list
      this.stockBriefStore.push(response.json());
      this.stockBriefSubject.next(this.stockBriefStore);
    }, this.handleError);
  }

  getStockDetail (symbol) {
    this.http.get( this.BASE_URL + '/alpha' + symbol).subscribe(response => {
      // update the detailed stock information
      this.stockDetailStore = response.json();
      this.stockDetailSubject.next(this.stockDetailStore);
    }, this.handleError);
  }

  private handleError(error){
    //console.error(error);
  }
}
