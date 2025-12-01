import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {News} from "../../../model/News";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {ProductService} from "../../../service/product.service";
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  listProduct: Product[] = [];
  displayedColumns: string[] = ['id', 'title', 'imageUrl','category', 'isShow', 'update', 'delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  constructor(private productService: ProductService,
              private dialog: MatDialog,
              private firebaseStorageService: FirebaseStorageService,
              private router: Router,) {
  }
  ngOnInit(): void {
    this.loadProduct();
  }
  loadProduct(): void {
    this.productService.getListProduct().subscribe(data => {
      this.listProduct = data;
      this.dataSource = new MatTableDataSource<News>(this.listProduct);
      this.dataSource.paginator = this.paginator;
    });
  }

  toggleStatus(element: any) {
    const newStatus = !element.isShow;
    console.log('element', element);
    this.productService.updateStatus(element.id, newStatus).subscribe({
      next: () => {
        element.isShow = newStatus;
      },
      error: () => {
        console.log('update failed!')
      }
    });
  }

  deleteProduct(element: News): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {message: 'Bạn có chắc chắn muốn xóa mục này?', color: 'red'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const imagePath = element.imageStoragePath;
        let contentPaths: string[] = [];

        // Parse contentStoragePathsJson nếu có
        try {
          const raw = element.contentStoragePathsJson;
          if (typeof raw === 'string') {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              contentPaths = parsed as string[];
            }
          }
        } catch (e) {
          console.error('Lỗi parse contentStoragePathsJson:', e);
        }

        // Trích xuất đường dẫn từ nội dung HTML (Quill)
        const htmlContent = element.content;
        const quillPaths = this.firebaseStorageService.extractStoragePathsFromHtml(htmlContent ?? '');
        contentPaths.push(...quillPaths);

        // Xóa avatar + các file liên quan
        this.firebaseStorageService.deleteFileByPath(imagePath)
          .then(() => this.firebaseStorageService.deleteMultipleFilesByPaths(contentPaths))
          .then(() => {
            this.productService.deleteProduct(element.id!).subscribe({
              next: () => {
                this.listProduct = this.listProduct.filter(item => item.id !== element.id);
                this.dataSource.data = this.listProduct;
              },
              error: () => {
                console.log('Delete failed!');
              }
            });
          })
          .catch(() => console.log('Xóa file Firebase thất bại'));
      }
    });
  }
  goToEdit(element: any) {
    this.router.navigate(['/update-product', element.id]);
  }
}
