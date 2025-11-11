import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCarouselComponent } from './detail-carousel.component';

describe('DetailCarouselComponent', () => {
  let component: DetailCarouselComponent;
  let fixture: ComponentFixture<DetailCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCarouselComponent]
    });
    fixture = TestBed.createComponent(DetailCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
