import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyplaylistComponent } from './myplaylist.component';

describe('MyplaylistComponent', () => {
  let component: MyplaylistComponent;
  let fixture: ComponentFixture<MyplaylistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyplaylistComponent]
    });
    fixture = TestBed.createComponent(MyplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
