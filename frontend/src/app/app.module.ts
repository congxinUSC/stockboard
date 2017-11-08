import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatTabsModule
} from '@angular/material';

import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

import { AppComponent } from './app.component';
import { LookupComponent } from './lookup.component';
import { MainboardComponent } from './mainboard.component';
import { FavListComponent } from './favlist.component';
import { StockComponent } from './stock.component';
import { DetailComponent } from './detail.component';
import { LikeBtnComponent } from './likeBtn.component';
import { FbshareComponent } from './fbshare.component';
import { DetailTableComponent } from './detailTable.component';
import { ChartsComponent } from './charts.component';
import { HistChartComponent } from './histChart.component';
import { NewsFeedComponent } from './newsFeed.component';

import * as $ from 'jquery';

// (Services)
// Web
// LocalStorage
//    ^
//    |
//    v
// (Components)
// App
// | Lookup
// | Mainboard
//   | FavList
//   | Stock
//     | Detail
//       | LikeBtn
//       | Fbshare
//       | DetailTable
//       | Charts
//     | HistChart
//     | NewsFeed

// TODO: Clean UP!

@NgModule({
  declarations: [
    AppComponent,
    LookupComponent,
    MainboardComponent,
    FavListComponent,
    StockComponent,
    DetailComponent,
    LikeBtnComponent,
    FbshareComponent,
    DetailTableComponent,
    ChartsComponent,
    HistChartComponent,
    NewsFeedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTabsModule
  ],
  providers: [WebService, LocalStorageService],
  bootstrap: [AppComponent]

})
export class AppModule {}
