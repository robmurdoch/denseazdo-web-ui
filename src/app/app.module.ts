import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module'

import { NotFoundComponent } from './not-found/not-found.component';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';
// import { CollectionComponent } from './collection/collection.component';
// import { OrganizationComponent } from './organization/organization.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ConnectionDialogComponent,
    // CollectionComponent,
    // OrganizationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
