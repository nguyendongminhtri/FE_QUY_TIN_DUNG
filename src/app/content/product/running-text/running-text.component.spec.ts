import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningTextComponent } from './running-text.component';

describe('RunningTextComponent', () => {
  let component: RunningTextComponent;
  let fixture: ComponentFixture<RunningTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunningTextComponent]
    });
    fixture = TestBed.createComponent(RunningTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
