import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStorySuccessComponent } from './detail-story-success.component';

describe('DetailStorySuccessComponent', () => {
  let component: DetailStorySuccessComponent;
  let fixture: ComponentFixture<DetailStorySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailStorySuccessComponent]
    });
    fixture = TestBed.createComponent(DetailStorySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
