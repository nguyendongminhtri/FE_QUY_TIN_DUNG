import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSingerComponent } from './update-singer.component';

describe('UpdateSingerComponent', () => {
  let component: UpdateSingerComponent;
  let fixture: ComponentFixture<UpdateSingerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSingerComponent]
    });
    fixture = TestBed.createComponent(UpdateSingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
