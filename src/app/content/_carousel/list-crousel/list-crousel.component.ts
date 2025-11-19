import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {CarouselItem} from "../../../model/CarouselItem";
import {CarouselService} from "../../../service/carousel.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-crousel',
  templateUrl: './list-crousel.component.html',
  styleUrls: ['./list-crousel.component.css']
})
export class ListCrouselComponent implements OnInit {
  listCarousel: CarouselItem[] = [];
  displayedColumns: string[] = ['id', 'title', 'imageUrl', 'isShow', 'update','delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private carouselService: CarouselService,
              private dialog: MatDialog,
              private router: Router,
              private firebaseStorageService: FirebaseStorageService) {
  }

  ngOnInit(): void {
    this.loadCarousel();
  }

  loadCarousel(): void {
    this.carouselService.getListCarousel().subscribe(data => {
      this.listCarousel = data;
      this.dataSource = new MatTableDataSource<CarouselItem>(this.listCarousel);
      this.dataSource.paginator = this.paginator;
    });
  }

  toggleStatus(element: any) {
    const newStatus = !element.isShow;
    console.log('element', element);
    this.carouselService.updateStatus(element.id, newStatus).subscribe({
      next: () => {
        element.isShow = newStatus;
      },
      error: () => {
        console.log('update failed!')
      }
    });
  }

  deleteCarousel(element: CarouselItem): void {
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
            this.carouselService.deleteCarousel(element.id!).subscribe({
              next: () => {
                this.listCarousel = this.listCarousel.filter(item => item.id !== element.id);
                this.dataSource.data = this.listCarousel;
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
    this.router.navigate(['/carousel-update', element.id]);
  }
}
