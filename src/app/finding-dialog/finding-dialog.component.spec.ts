import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingDialogComponent } from './finding-dialog.component';

describe('FindingDialogComponent', () => {
  let component: FindingDialogComponent;
  let fixture: ComponentFixture<FindingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
