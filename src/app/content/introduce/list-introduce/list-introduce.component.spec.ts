import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIntroduceComponent } from './list-introduce.component';

describe('ListIntroduceComponent', () => {
  let component: ListIntroduceComponent;
  let fixture: ComponentFixture<ListIntroduceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListIntroduceComponent]
    });
    fixture = TestBed.createComponent(ListIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
