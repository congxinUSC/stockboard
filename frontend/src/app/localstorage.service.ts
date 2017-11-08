import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()

export class LocalStorageService {
  // Only store the symbols
  private favListStore = [''];
  favList;

  currentView=0;

  private selectedStore;
  private selectedSubject = new Subject();
  selected = this.selectedSubject.asObservable();

  constructor(){
    let tmp = localStorage.getItem('favlist');
    if(tmp){
      this.favListStore = JSON.parse(tmp);
    }
    this.favList = new BehaviorSubject(this.favListStore);
  }

  checkFavList(symbol) {
    return this.favListStore.indexOf(symbol);
  }

  setFavItem(symbol) {
    if(-1 === this.checkFavList(symbol)){
      this.favListStore.push(symbol);
      this.favList.next(this.favListStore);
      localStorage.setItem('favlist', JSON.stringify(this.favListStore));
    }
  }

  deleteFavItem(symbol) {
    this.favListStore = this.favListStore.filter(item=>item!==symbol);
    this.favList.next(this.favListStore);
    localStorage.setItem('favlist', JSON.stringify(this.favListStore));
  }

  setSelected(selected) {
    this.selectedStore=selected;
    this.selectedSubject.next(this.selectedStore);
  }

}
