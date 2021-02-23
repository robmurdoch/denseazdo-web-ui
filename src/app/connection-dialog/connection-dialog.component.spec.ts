import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ConnectionDialogComponent, DialogData } from './connection-dialog.component';
import { AzDoConnectionService } from '../core/services/azure-devops-connection.service';
import { AzDoService } from '../core/services/azdo.service';
import { SnackbarService } from '../core/services/snackbar.service';

// describe('ConnectionDialogComponent (minimal)', () => {
//   it('should create', () => {
//     TestBed.configureTestingModule({declarations: [ConnectionDialogComponent]});
//     const fixture = TestBed.createComponent(ConnectionDialogComponent);
//     const component = fixture.componentInstance;
//     expect(component).toBeDefined();
//   });
// });

describe('ConnectionDialogComponent', () => {
  // let httpClientSpy: { get: jasmine.Spy };
  const fakeModel: DialogData = {
    url: 'http://somesite/somecollection',
    token: 'AnAuthToken',
  };
  let component: ConnectionDialogComponent;
  let fixture: ComponentFixture<ConnectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionDialogComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        AzDoConnectionService,
        AzDoService,  
        SnackbarService,
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: fakeModel }
      ]
    })
      .compileComponents();
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
