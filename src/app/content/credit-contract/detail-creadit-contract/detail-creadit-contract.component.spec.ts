import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreaditContractComponent } from './detail-creadit-contract.component';

describe('DetailCreaditContractComponent', () => {
  let component: DetailCreaditContractComponent;
  let fixture: ComponentFixture<DetailCreaditContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCreaditContractComponent]
    });
    fixture = TestBed.createComponent(DetailCreaditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
