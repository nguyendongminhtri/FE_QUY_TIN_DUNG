import { TestBed } from '@angular/core/testing';

import { StorySuccessService } from './story-success.service';

describe('StorySuccessService', () => {
  let service: StorySuccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorySuccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
