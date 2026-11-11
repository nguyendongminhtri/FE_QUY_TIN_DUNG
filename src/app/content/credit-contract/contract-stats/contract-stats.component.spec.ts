import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatsComponent } from './contract-stats.component';

describe('ContractStatsComponent', () => {
  let component: ContractStatsComponent;
  let fixture: ComponentFixture<ContractStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractStatsComponent]
    });
    fixture = TestBed.createComponent(ContractStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
