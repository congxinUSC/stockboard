import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';

@Injectable()


export class WebService{

  BASE_URL = 'http://localhost:4201/api';

  private messagesStore = [];
  private messageSubject = new Subject();
  messages = this.messageSubject.asObservable();

  // Array of elements
  private symbolListStore = [];
  private symbolListSubject = new Subject();
  symbolList = this.symbolListSubject.asObservable();

  // The array that stores stock brief info in the favorite list
  private stockBriefStore = [];
  private stockBriefSubject = new Subject();
  stockBrief = this.stockBriefSubject.asObservable();

  // The object that stores the entire set of detailed info of the stock
  // Should contain data for all the points in the chart and news
  private stockDetailStore = {
    Table: null,
    Hist: null,
    PV: null,
    SMA: null,
    EMA: null,
    RSI: null,
    ADX: null,
    CCI: null,
    BBANDS: null,
    STOCH: null,
    MACD: null,
    news: null
  };
  private stockInfoTabSubject = new Subject();
  stockInfoTab = this.stockInfoTabSubject.asObservable();
  private stockHistSubject = new Subject();
  stockHist = this.stockHistSubject.asObservable();
  private stockPVSubject = new Subject();
  stockPV = this.stockPVSubject.asObservable();
  private stockSMASubject = new Subject();
  stockSMA = this.stockSMASubject.asObservable();
  private stockEMASubject = new Subject();
  stockEMA = this.stockEMASubject.asObservable();
  private stockRSISubject = new Subject();
  stockRSI = this.stockRSISubject.asObservable();
  private stockADXSubject = new Subject();
  stockADX = this.stockADXSubject.asObservable();
  private stockCCISubject = new Subject();
  stockCCI = this.stockCCISubject.asObservable();
  private stockBBANDSSubject = new Subject();
  stockBBANDS = this.stockBBANDSSubject.asObservable();
  private stockSTOCHSubject = new Subject();
  stockSTOCH = this.stockSTOCHSubject.asObservable();
  private stockMACDSubject = new Subject();
  stockMACD = this.stockMACDSubject.asObservable();
  private stocknewsSubject = new Subject();
  stocknews = this.stocknewsSubject.asObservable();

  private requestStatusStore = {
    PV: 'loading',
    SMA: 'loading',
    EMA: 'loading',
    RSI: 'loading',
    ADX: 'loading',
    CCI: 'loading',
    BBANDS: 'loading',
    STOCH: 'loading',
    MACD: 'loading',
    news: 'loading'
  };
  private requestStatusSubject = new Subject();
  requestStatus = this.requestStatusSubject.asObservable();

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
    symbol = (symbol) ? '/' + symbol : '';
    if(!(symbol)) return;

    this.requestStatusStore.PV = 'loading';
    this.requestStatusStore.SMA = 'loading';
    this.requestStatusStore.EMA = 'loading';
    this.requestStatusStore.RSI = 'loading';
    this.requestStatusStore.ADX = 'loading';
    this.requestStatusStore.CCI = 'loading';
    this.requestStatusStore.BBANDS = 'loading';
    this.requestStatusStore.STOCH = 'loading';
    this.requestStatusStore.MACD = 'loading';
    this.requestStatusStore.news = 'loading';
    this.requestStatusSubject.next(this.requestStatusStore);

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/PV').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.PV = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.PV = response.json().HCobj;
        this.stockDetailStore.Hist = response.json().HSobj;
        this.stockDetailStore.Table = response.json().TABobj;
        this.stockPVSubject.next(this.stockDetailStore.PV);
        this.stockHistSubject.next(this.stockDetailStore.Hist);
        this.stockInfoTabSubject.next(this.stockDetailStore.Table);

        this.requestStatusStore.PV = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.PV = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/SMA').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.SMA = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.SMA = response.json().HCobj;
        this.stockSMASubject.next(this.stockDetailStore.SMA);

        this.requestStatusStore.SMA = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.SMA = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/EMA').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.EMA = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.EMA = response.json().HCobj;
        this.stockEMASubject.next(this.stockDetailStore.EMA);

        this.requestStatusStore.EMA = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.EMA = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/RSI').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.RSI = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.RSI = response.json().HCobj;
        this.stockRSISubject.next(this.stockDetailStore.RSI);

        this.requestStatusStore.RSI = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.RSI = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/ADX').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.ADX = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.ADX = response.json().HCobj;
        this.stockADXSubject.next(this.stockDetailStore.ADX);

        this.requestStatusStore.ADX = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.ADX = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/CCI').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.CCI = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.CCI = response.json().HCobj;
        this.stockCCISubject.next(this.stockDetailStore.CCI);

        this.requestStatusStore.CCI = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.CCI = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/BBANDS').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.BBANDS = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.BBANDS = response.json().HCobj;
        this.stockBBANDSSubject.next(this.stockDetailStore.BBANDS);

        this.requestStatusStore.BBANDS = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.BBANDS = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/STOCH').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.STOCH = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.STOCH = response.json().HCobj;
        this.stockSTOCHSubject.next(this.stockDetailStore.STOCH);

        this.requestStatusStore.STOCH = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.STOCH = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha' + symbol + '/MACD').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.MACD = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.MACD = response.json().HCobj;
        this.stockMACDSubject.next(this.stockDetailStore.MACD);

        this.requestStatusStore.MACD = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.MACD = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/news' + symbol).subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.news = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.news = response.json();
        this.stocknewsSubject.next(this.stockDetailStore.news);

        this.requestStatusStore.news = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.news = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });
  }

  private handleError(error){
    console.error(error);
  }
}
