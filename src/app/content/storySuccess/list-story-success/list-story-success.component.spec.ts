import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStorySuccessComponent } from './list-story-success.component';

describe('ListStorySuccessComponent', () => {
  let component: ListStorySuccessComponent;
  let fixture: ComponentFixture<ListStorySuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListStorySuccessComponent]
    });
    fixture = TestBed.createComponent(ListStorySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
