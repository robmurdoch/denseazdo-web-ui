import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ CollectionComponent ]
    })
    .compileComponents();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
