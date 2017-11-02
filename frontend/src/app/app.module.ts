import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatTabsModule
  } from '@angular/material';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages.components';
import { NewMessageComponent } from './new-message.component';
import { WebService } from './web.service';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav.component';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.components';
import { LookupComponent } from './lookup.component';
import { FavListComponent } from './favlist.component';
import { ChartsComponent } from './charts.component';
import { DetailTableComponent } from './detailTable.component';
import { NewsFeedComponent } from './newsFeed.component';
import { HistChartComponent } from './histChart.component';

let routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'messages/:name',
    component: MessagesComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    NewMessageComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    LookupComponent,
    FavListComponent,
    ChartsComponent,
    HistChartComponent,
    DetailTableComponent,
    NewsFeedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTabsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forRoot(routes),
  ],
  providers: [WebService],
  bootstrap: [AppComponent]

})
export class AppModule { }
