import { TestBed } from '@angular/core/testing';

import { KpiManagementService } from './kpi-management.service';

describe('KpiManagementService', () => {
  let service: KpiManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
