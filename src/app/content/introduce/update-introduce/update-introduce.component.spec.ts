import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIntroduceComponent } from './update-introduce.component';

describe('UpdateIntroduceComponent', () => {
  let component: UpdateIntroduceComponent;
  let fixture: ComponentFixture<UpdateIntroduceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateIntroduceComponent]
    });
    fixture = TestBed.createComponent(UpdateIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
