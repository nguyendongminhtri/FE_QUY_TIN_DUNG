import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollTextComponent } from './scroll-text.component';

describe('ScrollTextComponent', () => {
  let component: ScrollTextComponent;
  let fixture: ComponentFixture<ScrollTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollTextComponent]
    });
    fixture = TestBed.createComponent(ScrollTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
