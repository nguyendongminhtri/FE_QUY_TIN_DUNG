import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStorySuccessComponent } from './update-story-success.component';

describe('UpdateStorySuccessComponent', () => {
  let component: UpdateStorySuccessComponent;
  let fixture: ComponentFixture<UpdateStorySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStorySuccessComponent]
    });
    fixture = TestBed.createComponent(UpdateStorySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
