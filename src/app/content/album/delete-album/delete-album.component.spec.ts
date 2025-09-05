import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAlbumComponent } from './delete-album.component';

describe('DeleteAlbumComponent', () => {
  let component: DeleteAlbumComponent;
  let fixture: ComponentFixture<DeleteAlbumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteAlbumComponent]
    });
    fixture = TestBed.createComponent(DeleteAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
