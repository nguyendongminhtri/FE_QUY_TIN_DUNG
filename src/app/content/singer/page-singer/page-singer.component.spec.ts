import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSingerComponent } from './page-singer.component';

describe('PageSingerComponent', () => {
  let component: PageSingerComponent;
  let fixture: ComponentFixture<PageSingerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageSingerComponent]
    });
    fixture = TestBed.createComponent(PageSingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
