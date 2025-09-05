import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {CreateCategoryComponent} from "../create-category/create-category.component";
import {DeleteCategoryComponent} from "../delete-category/delete-category.component";
import {UpdateCategoryComponent} from "../update-category/update-category.component";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-page-category',
  templateUrl: './page-category.component.html',
  styleUrls: ['./page-category.component.css']
})
export class PageCategoryComponent implements OnInit {
  listCategory?: Category[];
  totalElements: number = 0;
  checkUserAdmin = false;

  constructor(private categoryService: CategoryService,
              public dialog: MatDialog,
              private tokenService: TokenService,) {
  }

  getPageRequest(request: any) {
    this.categoryService.getPageCategory(request).subscribe(data => {
      // console.log('data -->', data)
      this.listCategory = data['content'];
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
    this.categoryService.getPageCategory(request).subscribe(data => {
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
    const dialogRef = this.dialog.open(CreateCategoryComponent);

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
        this.categoryService.deleteCategory(id).subscribe(() => {
          this.getPageRequest({page:0, size: 5})
        })
      }
    })
  }

  openDialogUpdate(id: any) {
    const dialogRef = this.dialog.open(UpdateCategoryComponent, {
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
