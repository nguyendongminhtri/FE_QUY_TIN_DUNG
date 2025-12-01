import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../../model/Category";
import {MatTableDataSource} from "@angular/material/table";
import {CarouselItem} from "../../../model/CarouselItem";
import {CategoryService} from "../../../service/category.service";
import {MatPaginator} from "@angular/material/paginator";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {UpdateCategoryComponent} from "../update-category/update-category.component";

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  listCategory: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'type', 'update', 'delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategory = data;
      this.dataSource = new MatTableDataSource<Category>(this.listCategory);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteCategory(element: Category): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {message: 'Bạn có chắc chắn muốn xóa mục này?', color: 'red'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(element.id!).subscribe({
          next: () => {
            this.listCategory = this.listCategory.filter(item => item.id !== element.id);
            this.dataSource.data = this.listCategory;
          },
          error: () => {
            console.log('Delete failed!');
          }
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
      if (result) {
        this.loadCategory();
      }
    });
  }
}
