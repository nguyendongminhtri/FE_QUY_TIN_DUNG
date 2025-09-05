import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSingerComponent } from './delete-singer.component';

describe('DeleteSingerComponent', () => {
  let component: DeleteSingerComponent;
  let fixture: ComponentFixture<DeleteSingerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSingerComponent]
    });
    fixture = TestBed.createComponent(DeleteSingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
