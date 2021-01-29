import { TestBed } from '@angular/core/testing';

import { AzdoService } from './azdo.service';

describe('AzdoService', () => {
  let service: AzdoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzdoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
