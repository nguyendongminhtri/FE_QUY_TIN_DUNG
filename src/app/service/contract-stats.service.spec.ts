import { TestBed } from '@angular/core/testing';

import { ContractStatsService } from './contract-stats.service';

describe('ContractStatsService', () => {
  let service: ContractStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
