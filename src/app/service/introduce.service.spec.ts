import { TestBed } from '@angular/core/testing';

import { IntroduceService } from './introduce.service';

describe('IntroduceService', () => {
  let service: IntroduceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroduceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
