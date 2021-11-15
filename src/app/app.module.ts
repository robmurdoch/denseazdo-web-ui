import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './core/shared/material.module';

import { NotFoundComponent } from './not-found/not-found.component';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';
import { CollectionComponent } from './collection/collection.component';
import { ProjectComponent } from './project/project.component';
import { StripNamePipe } from './collection/strip-name.pipe';
import { CollectionSecurityComponent } from './collection/collection-security.component';
import { FindingDialogComponent } from './finding-dialog/finding-dialog.component';
import { ProjectSecurityComponent } from './project/project-security.component';
// import { OrganizationComponent } from './organization/organization.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ConnectionDialogComponent,
    CollectionComponent,
    ProjectComponent,
    StripNamePipe,
    CollectionSecurityComponent,
    FindingDialogComponent,
    ProjectSecurityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
