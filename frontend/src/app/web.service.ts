import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';

declare let FB: any;

@Injectable()

export class WebService{

  BASE_URL= 'http://gettingstarte-5d4e3-env.us-west-2.elasticbeanstalk.com/api';
  // BASE_URL= 'http://localhost:8081/api';
  FBAppID= '714520475409811';
  // FBAppID= '1340180782759111';

  // Array of elements
  private AutoCompleteListStore = [];
  private AutoCompleteListSubject = new Subject();
  AutoCompleteList = this.AutoCompleteListSubject.asObservable();

  // The array that stores stock brief info in the favorite list
  private stockBriefStore = new Map();
  private stockBriefSubject = new Subject<any[]>();
  stockBrief = this.stockBriefSubject.asObservable();

  // The object that stores the entire set of detailed info of the stock
  // Should contain data for all the points in the chart and news
  private stockDetailStore = {
    Table: null,
    Hist: null,
    Price: null,
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
    Price: 'loading',
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
  private requestStatusSubject = new Subject<any>();
  requestStatus = this.requestStatusSubject.asObservable();

  currentSymbol:string;
  constructor (private http: Http) {}

  clearResult () {
    this.currentSymbol='';
  }

  getSymbolList (short) {
    if(!(short)) return;
    this.http.get(this.BASE_URL + '/lookup/' + short).subscribe(response => {
      // update the symbol list
      this.AutoCompleteListStore = response.json();
      this.AutoCompleteListSubject.next(this.AutoCompleteListStore);
    }, this.defaultErrorHandler);
  }

  getStockBrief (symbol) {
    if(!(symbol)) return;
    this.http.get(this.BASE_URL + '/short/' + symbol).subscribe( response => {
      if(response.json().error || !(response.json().LastPrice)) {
        this.stockBriefStore.set(symbol ,{Symbol:symbol,LastPrice:NaN,Change:NaN,ChangePercent:NaN,Volume:NaN});
        this.stockBriefSubject.next(Array.from(this.stockBriefStore));
      } else {
        this.stockBriefStore.set(symbol ,response.json());
        this.stockBriefSubject.next(Array.from(this.stockBriefStore));
      }
    }, ()=>{
      this.stockBriefStore.set(symbol ,{Symbol:symbol,LastPrice:NaN,Change:NaN,ChangePercent:NaN,Volume:NaN});
      this.stockBriefSubject.next(Array.from(this.stockBriefStore));
    });
  }

  getStockDetail (symbol) {
    if(!(symbol)) return;

    this.currentSymbol = symbol;
    this.requestStatusStore.Price = 'loading';
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


    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/Price').subscribe(response => {
      // update the detailed stock information
      if(response.json().error) {
        this.requestStatusStore.Price = 'error';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
      else {
        this.stockDetailStore.Price = response.json().HCobj;
        this.stockDetailStore.Hist = response.json().HSobj;
        this.stockDetailStore.Table = response.json().TABobj;
        this.stockPVSubject.next(this.stockDetailStore.Price);
        this.stockHistSubject.next(this.stockDetailStore.Hist);
        this.stockInfoTabSubject.next(this.stockDetailStore.Table);

        this.requestStatusStore.Price = 'OK';
        this.requestStatusSubject.next(this.requestStatusStore);
      }
    }, () => {
      this.requestStatusStore.Price = 'error';
      this.requestStatusSubject.next(this.requestStatusStore);
    });

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/SMA').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/EMA').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/RSI').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/ADX').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/CCI').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/BBANDS').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/STOCH').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/alpha/' + symbol + '/MACD').subscribe(response => {
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

    this.http.get( this.BASE_URL + '/news/' + symbol).subscribe(response => {
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

  fbshare(type) {
    // const exportURL = 'http://export.highcharts.com/';
    let exportURL = this.BASE_URL+'/chart';
    let data = {
      options: JSON.stringify(this.stockDetailStore[type]),
      filename: 'mychart',
      type: 'image/png',
      async: true
    };
    this.http.post(exportURL ,data).subscribe(response => {
      // let retURL = exportURL+response['_body'];
      let retURL = response['_body'];
      FB.init({
        appId: this.FBAppID,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.1'
      });

      FB.ui({
        appId: this.FBAppID,
        method: 'feed',
        picture: retURL
      }, (response) => {
        if (response && !response.error_message) {
          alert("Posted Successfully");
        } else {
          alert("Not Posted");
        }
      });
    });
  }

  private defaultErrorHandler(error){
    console.error(error);
  }
}
