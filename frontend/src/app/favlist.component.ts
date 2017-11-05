import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'favlist',
  templateUrl: './favlist.component.html',
})
export class FavListComponent {
  constructor(private webService : WebService) {}

}
