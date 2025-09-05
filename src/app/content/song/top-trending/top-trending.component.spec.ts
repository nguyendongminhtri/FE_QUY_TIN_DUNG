import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTrendingComponent } from './top-trending.component';

describe('TopTrendingComponent', () => {
  let component: TopTrendingComponent;
  let fixture: ComponentFixture<TopTrendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopTrendingComponent]
    });
    fixture = TestBed.createComponent(TopTrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
