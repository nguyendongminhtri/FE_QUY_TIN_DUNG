import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiKetoanComponent } from './kpi-ketoan.component';

describe('KpiKetoanComponent', () => {
  let component: KpiKetoanComponent;
  let fixture: ComponentFixture<KpiKetoanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiKetoanComponent]
    });
    fixture = TestBed.createComponent(KpiKetoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
