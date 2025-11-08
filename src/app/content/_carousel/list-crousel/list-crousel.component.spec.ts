import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCrouselComponent } from './list-crousel.component';

describe('ListCrouselComponent', () => {
  let component: ListCrouselComponent;
  let fixture: ComponentFixture<ListCrouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCrouselComponent]
    });
    fixture = TestBed.createComponent(ListCrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
