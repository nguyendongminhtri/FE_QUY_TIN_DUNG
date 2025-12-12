import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditContractComponent } from './list-credit-contract.component';

describe('ListCreditContractComponent', () => {
  let component: ListCreditContractComponent;
  let fixture: ComponentFixture<ListCreditContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCreditContractComponent]
    });
    fixture = TestBed.createComponent(ListCreditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
