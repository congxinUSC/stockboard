import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <new-message></new-message>
    <messages></messages>
    <lookup></lookup>
    <favlist></favlist>
    <DetailTab></DetailTab>
    <charts></charts>
    <NewsFeed></NewsFeed>
    <histChart></histChart>
  `
  ,
})
export class HomeComponent {}
