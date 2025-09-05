import {Component, ViewChild} from '@angular/core';
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";
import {MatDialog} from "@angular/material/dialog";
import {TokenService} from "../../../service/token.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CreateCategoryComponent} from "../../category/create-category/create-category.component";
import {DeleteCategoryComponent} from "../../category/delete-category/delete-category.component";
import {UpdateCategoryComponent} from "../../category/update-category/update-category.component";
import {AlbumService} from "../../../service/album.service";
import {Album} from "../../../model/Album";
import {CreateAlbumComponent} from "../create-album/create-album.component";
import {UpdateAlbumComponent} from "../update-album/update-album.component";

@Component({
  selector: 'app-page-album',
  templateUrl: './page-album.component.html',
  styleUrls: ['./page-album.component.css']
})
export class PageAlbumComponent {
  listAlbum?: Album[];
  totalElements: number = 0;
  checkUserAdmin = false;

  constructor(private albumService: AlbumService,
              public dialog: MatDialog,
              private tokenService: TokenService,) {
  }

  getPageRequest(request: any) {
    this.albumService.getPageAlbum(request).subscribe(data => {
      // console.log('data -->', data)
      this.listAlbum = data['content'];
      // console.log('content --->', this.listCategory)
      this.totalElements = data['totalElements'];
      // console.log('total --->', this.totalElements)
    })
  }

  ngOnInit(): void {
    const request = {page: 0, size: 5}
    this.getPageRequest(request);

    if (this.tokenService.getToken()) {
      console.log('role ---->', this.tokenService.getRole())
      if (JSON.stringify(this.tokenService.getRole()) == JSON.stringify(['ADMIN'])) {
        this.checkUserAdmin = true;
      }
    }
    this.albumService.getPageAlbum(request).subscribe(data => {
      this.getPageRequest({page: 0, size: 5})
    })
  }


  nextPage($event: PageEvent) {
    const request = {};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    this.getPageRequest(request);
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  openDialogCreate() {
    const dialogRef = this.dialog.open(CreateAlbumComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result || result == undefined) {
        this.getPageRequest({page: 0, size: 5});
      }
    })
  }

  openDialogDelete(id: any) {
    const dialogRef = this.dialog.open(DeleteCategoryComponent)

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result, "result tren")
      if (result) {
        this.albumService.deleteAlbum(id).subscribe(() => {
          this.getPageRequest({page:0, size: 5})
        })
      }
    })
  }

  openDialogUpdate(id: any) {
    const dialogRef = this.dialog.open(UpdateAlbumComponent, {
      data: {
        dataKey: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result || result == undefined) {
        this.getPageRequest({page: 0, size: 5});
      }
    });
  }
}
