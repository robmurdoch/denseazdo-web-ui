import { TestBed } from '@angular/core/testing';

import { AzdoCacheService } from './azdo-cache.service';

describe('AzdoCacheService', () => {
  let service: AzdoCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzdoCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
