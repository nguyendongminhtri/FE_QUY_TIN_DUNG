import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAlbumComponent } from './page-album.component';

describe('PageAlbumComponent', () => {
  let component: PageAlbumComponent;
  let fixture: ComponentFixture<PageAlbumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageAlbumComponent]
    });
    fixture = TestBed.createComponent(PageAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
