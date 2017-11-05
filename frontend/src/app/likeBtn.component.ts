import { Component } from '@angular/core'
import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

@Component({
  selector: 'likeBtn',
  template: `
    <button (click)="toggle(symbol)" type="button" class="btn btn-default">
      <ng-template *ngIf="localStorageService.checkFavList(symbol) !== -1; then filledStar else emptyStar" ></ng-template>
      <ng-template #filledStar>
        <i class="glyphicon glyphicon-star" style="font-size:100%; color:#FED531"></i>
      </ng-template>
      <ng-template #emptyStar>
        <i class="glyphicon glyphicon-star-empty" style="font-size:100%; color:#FED531"></i>
      </ng-template>
    </button>
  `,
})

export class LikeBtnComponent {

  symbol;

  constructor(public webService: WebService, public localStorageService: LocalStorageService) {}

  ngOnInit(){
    this.webService.currentSymbol.subscribe(str=>this.symbol=str);
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
