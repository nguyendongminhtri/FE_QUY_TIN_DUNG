import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIntroduceComponent } from './create-introduce.component';

describe('CreateIntroduceComponent', () => {
  let component: CreateIntroduceComponent;
  let fixture: ComponentFixture<CreateIntroduceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIntroduceComponent]
    });
    fixture = TestBed.createComponent(CreateIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
