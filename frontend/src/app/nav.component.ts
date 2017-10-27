import { Component } from '@angular/core';

@Component({
  selector: 'nav',
  template: `
    <mat-toolbar>
      <button mat-button routerLink="/">Home</button>
      <button mat-button routerLink="/messages">Messages</button>
      <button mat-button routerLink="/register">Register</button>
    </mat-toolbar>
  `
})


export class NavComponent {
  constructor () {}
}
