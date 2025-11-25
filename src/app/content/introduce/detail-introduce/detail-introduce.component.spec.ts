import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIntroduceComponent } from './detail-introduce.component';

describe('DetailIntroduceComponent', () => {
  let component: DetailIntroduceComponent;
  let fixture: ComponentFixture<DetailIntroduceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailIntroduceComponent]
    });
    fixture = TestBed.createComponent(DetailIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
