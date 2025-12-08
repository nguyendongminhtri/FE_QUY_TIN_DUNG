import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditContractComponent } from './create-credit-contract.component';

describe('CreateCreditContractComponent', () => {
  let component: CreateCreditContractComponent;
  let fixture: ComponentFixture<CreateCreditContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCreditContractComponent]
    });
    fixture = TestBed.createComponent(CreateCreditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
