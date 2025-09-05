import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSingerComponent } from './detail-singer.component';

describe('DetailSingerComponent', () => {
  let component: DetailSingerComponent;
  let fixture: ComponentFixture<DetailSingerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailSingerComponent]
    });
    fixture = TestBed.createComponent(DetailSingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
