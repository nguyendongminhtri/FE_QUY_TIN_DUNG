import {Component, OnInit, ViewChild} from '@angular/core';
import {News} from "../../../model/News";
import {MatPaginator} from "@angular/material/paginator";
import {NewsService} from "../../../service/news.service";
import {MatDialog} from "@angular/material/dialog";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {IntroduceService} from "../../../service/introduce.service";
import {Introduce} from "../../../model/Introduce";

@Component({
  selector: 'app-list-introduce',
  templateUrl: './list-introduce.component.html',
  styleUrls: ['./list-introduce.component.css']
})
export class ListIntroduceComponent implements OnInit {
  listIntroduce: Introduce[] = [];
  displayedColumns: string[] = ['id', 'title', 'isShow', 'delete', 'update'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private introduceService: IntroduceService,
              private dialog: MatDialog,
              private firebaseStorageService: FirebaseStorageService,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.loadIntroduce();
  }

  loadIntroduce(): void {
    this.introduceService.getListIntroduce().subscribe(data => {
      this.listIntroduce = data;
      this.dataSource = new MatTableDataSource<News>(this.listIntroduce);
      this.dataSource.paginator = this.paginator;
    });
  }


  toggleStatus(element: any) {
    const newStatus = !element.isShow;
    console.log('element', element);
    this.introduceService.updateStatus(element.id, newStatus).subscribe({
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
            this.introduceService.deleteNews(element.id!).subscribe({
              next: () => {
                this.listIntroduce = this.listIntroduce.filter(item => item.id !== element.id);
                this.dataSource.data = this.listIntroduce;
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
    this.router.navigate(['/update-introduce', element.id]);
  }
}
