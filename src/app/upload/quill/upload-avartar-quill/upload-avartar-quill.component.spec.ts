import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAvartarQuillComponent } from './upload-avartar-quill.component';

describe('UploadAvartarQuillComponent', () => {
  let component: UploadAvartarQuillComponent;
  let fixture: ComponentFixture<UploadAvartarQuillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAvartarQuillComponent]
    });
    fixture = TestBed.createComponent(UploadAvartarQuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
