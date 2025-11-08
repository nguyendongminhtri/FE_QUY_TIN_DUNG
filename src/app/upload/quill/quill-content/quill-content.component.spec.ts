import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillContentComponent } from './quill-content.component';

describe('QuillContentComponent', () => {
  let component: QuillContentComponent;
  let fixture: ComponentFixture<QuillContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuillContentComponent]
    });
    fixture = TestBed.createComponent(QuillContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
