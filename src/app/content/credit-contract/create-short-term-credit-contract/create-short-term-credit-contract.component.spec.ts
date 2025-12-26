import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShortTermCreditContractComponent } from './create-short-term-credit-contract.component';

describe('CreateShortTermCreditContractComponent', () => {
  let component: CreateShortTermCreditContractComponent;
  let fixture: ComponentFixture<CreateShortTermCreditContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateShortTermCreditContractComponent]
    });
    fixture = TestBed.createComponent(CreateShortTermCreditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
