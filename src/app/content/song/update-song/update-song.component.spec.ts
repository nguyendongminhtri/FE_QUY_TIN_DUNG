import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSongComponent } from './update-song.component';

describe('UpdateSongComponent', () => {
  let component: UpdateSongComponent;
  let fixture: ComponentFixture<UpdateSongComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSongComponent]
    });
    fixture = TestBed.createComponent(UpdateSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
