import { Component } from '@angular/core';
import { MessagesComponent } from './messages.components';
import { NewMessageComponent } from './new-message.component';
import { NavComponent} from './nav.component';
import { ChatsComponent } from './chats.component';

@Component({
  selector: 'home',
  template: `
    <new-message></new-message>
    <messages></messages>
    <lookup></lookup>
    <favlist></favlist>
    <charts></charts>
  `
  ,
})
export class HomeComponent {}
