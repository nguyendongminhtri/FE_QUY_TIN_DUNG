import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarouselComponent } from './update-carousel.component';

describe('UpdateCarouselComponent', () => {
  let component: UpdateCarouselComponent;
  let fixture: ComponentFixture<UpdateCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCarouselComponent]
    });
    fixture = TestBed.createComponent(UpdateCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
