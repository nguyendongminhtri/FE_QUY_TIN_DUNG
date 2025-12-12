import { TestBed } from '@angular/core/testing';

import { UploadMultipleAvatarService } from './upload-multiple-avatar.service';

describe('UploadMultipleAvatarService', () => {
  let service: UploadMultipleAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadMultipleAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
