import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNewsComponent } from './detail-news.component';

describe('DetailNewsComponent', () => {
  let component: DetailNewsComponent;
  let fixture: ComponentFixture<DetailNewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailNewsComponent]
    });
    fixture = TestBed.createComponent(DetailNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
