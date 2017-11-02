import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'favlist',
  template: `

    <div *ngFor="let brief of webService.stockBrief | async">
      <mat-card class="card">
        <mat-card-title>{{brief.Name}}</mat-card-title>
        <mat-card-content>{{brief.Symbol}}</mat-card-content>
      </mat-card>
    </div>
  `,
})
export class FavListComponent {
  constructor(private webService : WebService) {}

}
