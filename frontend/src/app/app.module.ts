import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  } from '@angular/material';

import { WebService } from './web.service';
import { LocalStorageService } from './localstorage.service';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupComponent } from './lookup.component';
import { FavListComponent } from './favlist.component';
import { ChartsComponent } from './charts.component';
import { DetailTableComponent } from './detailTable.component';
import { NewsFeedComponent } from './newsFeed.component';
import { HistChartComponent } from './histChart.component';
import { DetailComponent } from './detail.component';
import { FbshareComponent } from './fbshare.component';
import { LikeBtnComponent } from './likeBtn.component';
import { StockComponent } from './stock.component';

// TODO: Clean UP!

@NgModule({
  declarations: [
    AppComponent,
    LookupComponent,
    FavListComponent,
    ChartsComponent,
    HistChartComponent,
    DetailTableComponent,
    NewsFeedComponent,
    FbshareComponent,
    LikeBtnComponent,
    DetailComponent,
    StockComponent
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
  ],
  providers: [WebService, LocalStorageService],
  bootstrap: [AppComponent]

})
export class AppModule { }
