import { Component, OnInit } from '@angular/core'
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

// TODO: style problem icon too small

@Component({
  selector: 'likeBtn',
  template: `
    <button (click)="toggle(webService.currentSymbol)" type="button" class="btn btn-default">
      <ng-template *ngIf="localStorageService.checkFavList(webService.currentSymbol) !== -1; then filledStar else emptyStar"></ng-template>
      <ng-template #filledStar>
        <i class="glyphicon glyphicon-star" style="color:#FED531"></i>
      </ng-template>
      <ng-template #emptyStar>
        <i class="glyphicon glyphicon-star-empty" style="color:#000000"></i>
      </ng-template>
    </button>
  `,
})

export class LikeBtnComponent implements OnInit{

  constructor(public webService: WebService, public localStorageService: LocalStorageService) {}

  ngOnInit(){
    this.localStorageService.favList.subscribe(obj=>console.log(obj));
  }

  toggle(symbol){
    if((!symbol)) return;

    let i=this.localStorageService.checkFavList(symbol);
    if(-1===i) {
      this.localStorageService.setFavItem(symbol);
    } else {
      this.localStorageService.deleteFavItem(symbol);
    }
  }
}
