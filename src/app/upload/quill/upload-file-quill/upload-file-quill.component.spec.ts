import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileQuillComponent } from './upload-file-quill.component';

describe('UploadFileQuillComponent', () => {
  let component: UploadFileQuillComponent;
  let fixture: ComponentFixture<UploadFileQuillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFileQuillComponent]
    });
    fixture = TestBed.createComponent(UploadFileQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
