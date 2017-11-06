import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()

export class LocalStorageService {
  // Array of elements
  private favListStore = [''];

  favList;

  constructor(){
    this.favListStore = JSON.parse(localStorage.getItem('favlist'));
    this.favList = new BehaviorSubject(this.favListStore);
  }

  private selectedStore;
  private selectedSubject = new Subject();
  selected = this.selectedSubject.asObservable();


  checkFavList(symbol) {
    return this.favListStore.indexOf(symbol);
  }
  setFavItem(symbol) {
    if(-1 === this.checkFavList(symbol)){
      this.favListStore.push(symbol);
      // this.favListSubject.next(this.favListStore);
      this.favList.next(this.favListStore);
      localStorage.setItem('favlist', JSON.stringify(this.favListStore));
    }
  }
  deleteFavItem(symbol) {
    this.favListStore = this.favListStore.filter(item=>item!==symbol);
    // this.favListSubject.next(this.favListStore);
    this.favList.next(this.favListStore);
    localStorage.setItem('favlist', JSON.stringify(this.favListStore));
  }
  setSelected(selected) {
    this.selectedStore=selected;
    this.selectedSubject.next(this.selectedStore);
  }

}
