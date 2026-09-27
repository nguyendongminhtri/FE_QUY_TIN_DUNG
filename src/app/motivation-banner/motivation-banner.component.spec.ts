import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivationBannerComponent } from './motivation-banner.component';

describe('MotivationBannerComponent', () => {
  let component: MotivationBannerComponent;
  let fixture: ComponentFixture<MotivationBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotivationBannerComponent]
    });
    fixture = TestBed.createComponent(MotivationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
