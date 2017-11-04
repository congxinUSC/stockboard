import { Component } from '@angular/core'
import { WebService } from './web.service';

@Component({
  selector: 'fb-share',
  template: `
    <button (click)="post()" mat-button color="primary">POST</button>
  `
})

export class FbshareComponent {


  constructor(private webService : WebService) {}

  post(){
  }
}
