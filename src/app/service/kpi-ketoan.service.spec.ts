import { TestBed } from '@angular/core/testing';

import { KpiKetoanService } from './kpi-ketoan.service';

describe('KpiKetoanService', () => {
  let service: KpiKetoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiKetoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
