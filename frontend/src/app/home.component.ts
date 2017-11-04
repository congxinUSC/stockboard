import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <new-message></new-message>
    <messages></messages>
    <lookup></lookup>
    <favlist></favlist>
    <Detail></Detail>
    <NewsFeed></NewsFeed>
    <histChart></histChart>
  `
  ,
})
export class HomeComponent {}
