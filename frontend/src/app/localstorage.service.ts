import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';

@Injectable()

export class LocalStorageService {
  // Array of elements
  private favListStore = [];
  private favListSubject = new Subject<any[]>();
  favList = this.favListSubject.asObservable();

  private selectedStore;
  private selectedSubject = new Subject();
  selected = this.selectedSubject.asObservable();

  ngOnInit() {
    this.favListStore = JSON.parse(localStorage.getItem('favlist'));
    this.favListSubject.next(this.favListStore);
  }
  checkFavList(symbol) {
    return this.favListStore.indexOf(symbol);
  }
  setFavItem(symbol) {
    console.log('in setFavItem');
    if(-1 === this.checkFavList(symbol)){
      this.favListStore.push(symbol);
      this.favListSubject.next(this.favListStore);
      localStorage.setItem('favlist', JSON.stringify(this.favListStore));
    }
  }
  deleteFavItem(symbol) {
    this.favListStore = this.favListStore.filter(item=>item!==symbol);
    this.favListSubject.next(this.favListStore);
    localStorage.setItem('favlist', JSON.stringify(this.favListStore));
  }
  setSelected(selected) {
    this.selectedStore=selected;
    this.selectedSubject.next(this.selectedStore);
  }

}
