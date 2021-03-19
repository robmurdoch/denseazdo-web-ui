import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSecurityComponent } from './collection-security.component';

describe('CollectionSecurityComponent', () => {
  let component: CollectionSecurityComponent;
  let fixture: ComponentFixture<CollectionSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
