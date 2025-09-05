import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSongComponent } from './page-song.component';

describe('PageSongComponent', () => {
  let component: PageSongComponent;
  let fixture: ComponentFixture<PageSongComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageSongComponent]
    });
    fixture = TestBed.createComponent(PageSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
