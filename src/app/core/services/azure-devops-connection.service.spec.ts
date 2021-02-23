import { TestBed } from '@angular/core/testing';

import { AzDoConnectionService } from './azure-devops-connection.service';

describe('AzDoConnectionService', () => {
  let service: AzDoConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzDoConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
