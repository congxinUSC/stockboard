import { Component } from '@angular/core';
import { WebService } from './web.service';

@Component({
  selector: 'Detail',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-xs-6">
          <div class="row">
            <div class="col-xs-6">
              <b>Stock Details</b>
            </div>
            <div class="col-xs-6 text-right">
              
            </div>
          </div>
          <DetailTab></DetailTab>
        </div>
        <div class="col-xs-6">
          <charts></charts>
        </div>
      </div>
    </div>
  `,
})
export class DetailComponent {

  constructor(public webService : WebService) {}

}
