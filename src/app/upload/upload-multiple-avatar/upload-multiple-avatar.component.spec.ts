import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMultipleAvatarComponent } from './upload-multiple-avatar.component';

describe('UploadMultipleAvatarComponent', () => {
  let component: UploadMultipleAvatarComponent;
  let fixture: ComponentFixture<UploadMultipleAvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadMultipleAvatarComponent]
    });
    fixture = TestBed.createComponent(UploadMultipleAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
