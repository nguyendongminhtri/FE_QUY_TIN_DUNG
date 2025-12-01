import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStorySuccessComponent } from './create-story-success.component';

describe('CreateStorySuccessComponent', () => {
  let component: CreateStorySuccessComponent;
  let fixture: ComponentFixture<CreateStorySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStorySuccessComponent]
    });
    fixture = TestBed.createComponent(CreateStorySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
