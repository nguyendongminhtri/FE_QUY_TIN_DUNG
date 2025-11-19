import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {NewsService} from "../../../service/news.service";
import {News} from "../../../model/News";
import {MatTableDataSource} from "@angular/material/table";
import {CarouselItem} from "../../../model/CarouselItem";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.css']
})
export class ListNewsComponent implements OnInit{
  listNews: News[] = [];
  displayedColumns: string[] = ['id', 'title', 'imageUrl','isShow', 'delete', 'update'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  constructor(private newsService: NewsService,
              private dialog: MatDialog,
              private firebaseStorageService: FirebaseStorageService,
              private router: Router,) {
  }
  ngOnInit(): void {
    this.loadNews();
  }
  loadNews(): void {
    this.newsService.getListNews().subscribe(data => {
      this.listNews = data;
      this.dataSource = new MatTableDataSource<News>(this.listNews);
      this.dataSource.paginator = this.paginator;
    });
  }



  toggleStatus(element: any) {
    const newStatus = !element.isShow;
    console.log('element', element);
    this.newsService.updateStatus(element.id, newStatus).subscribe({
      next: () => {
        element.isShow = newStatus;
      },
      error: () => {
        console.log('update failed!')
      }
    });
  }

  deleteNews(element: News): void {
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
            this.newsService.deleteNews(element.id!).subscribe({
              next: () => {
                this.listNews = this.listNews.filter(item => item.id !== element.id);
                this.dataSource.data = this.listNews;
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
    this.router.navigate(['/news-update', element.id]);
  }
}
