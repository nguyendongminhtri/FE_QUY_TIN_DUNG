import { TestBed } from '@angular/core/testing';

import { CreditContractService } from './credit-contract.service';

describe('CreditContractService', () => {
  let service: CreditContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
