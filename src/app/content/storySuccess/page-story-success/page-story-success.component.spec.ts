import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStorySuccessComponent } from './page-story-success.component';

describe('PageStorySuccessComponent', () => {
  let component: PageStorySuccessComponent;
  let fixture: ComponentFixture<PageStorySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageStorySuccessComponent]
    });
    fixture = TestBed.createComponent(PageStorySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
