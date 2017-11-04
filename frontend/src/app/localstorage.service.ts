import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';

@Injectable()

export class LocalStorageService {
  // Array of elements
  private favListStore = [];
  private favListSubject = new Subject();
  favList = this.favListSubject.asObservable();

  ngOnInit() {
    this.favListStore = JSON.parse(localStorage.getItem('favlist'));
    this.favListSubject.next(this.favListStore);
  }
  setFavList(symbol) {
    symbol = symbol.toUpperCase();
    let i = this.favListStore.indexOf(symbol);
    if( i === -1){
      this.favListStore.push(symbol);
      this.favListSubject.next(this.favListStore);
      localStorage.setItem('favlist', JSON.stringify(this.favListStore));
    }
  }
  deleteFavItem(symbol) {
    symbol = symbol.toUpperCase();
    let i = this.favListStore.indexOf(symbol);
    if( i === -1){
      this.favListStore.slice(i, 1);
      this.favListSubject.next(this.favListStore);
      localStorage.setItem('favlist', JSON.stringify(this.favListStore));
    }
  }
}
