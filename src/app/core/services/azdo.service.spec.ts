import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { AzDoService } from './azdo.service';

describe('AzDoService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: AzDoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AzDoService]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = TestBed.inject(AzDoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
