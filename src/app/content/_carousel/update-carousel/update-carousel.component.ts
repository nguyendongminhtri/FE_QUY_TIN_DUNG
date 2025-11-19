import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CarouselService } from "../../../service/carousel.service";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { QuillContentComponent } from "../../../upload/quill/quill-content/quill-content.component";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-update-carousel',
  templateUrl: './update-carousel.component.html',
  styleUrls: ['./update-carousel.component.css']
})
export class UpdateCarouselComponent implements OnInit {
  form!: FormGroup;
  currentImageUrl: string = '';
  carouselId!: string;

  @ViewChild('quillContent') quillContent!: QuillContentComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carouselService: CarouselService,
    private afStorage: AngularFireStorage,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carouselId = this.route.snapshot.paramMap.get('id') ?? '';

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      imageUrl: ['', Validators.required],
      imageStoragePath: [''],
      contentStoragePathsJson: [JSON.stringify([])]
    });

    if (this.carouselId) {
      this.carouselService.getCarouselById(+this.carouselId).subscribe(data => {
        this.form.patchValue(data);
        this.currentImageUrl = data.imageUrl ?? '';
      });
    }
  }

  onUpload(fileInfo: { downloadURL: string; storagePath: string }) {
    const oldPath = this.form.get('imageStoragePath')?.value;
    if (oldPath && oldPath !== fileInfo.storagePath) {
      this.afStorage.ref(oldPath).delete().subscribe({
        next: () => console.log('Deleted old image:', oldPath),
        error: err => console.warn('Failed to delete old image:', err)
      });
    }

    this.form.patchValue({
      imageUrl: fileInfo.downloadURL,
      imageStoragePath: fileInfo.storagePath
    });

    this.currentImageUrl = fileInfo.downloadURL;
  }

  onUpdate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Bước 1: Parse danh sách file cũ từ form
    let oldFiles: { downloadURL: string; storagePath: string }[] = [];
    const raw = this.form.get('contentStoragePathsJson')?.value;

    try {
      const parsed = JSON.parse(raw || '[]');
      oldFiles = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Invalid JSON in contentStoragePathsJson:', raw);
    }

    // Bước 2: Lấy nội dung HTML hiện tại từ Quill
    const currentHTML = this.quillContent?.getCurrentContentHTML() ?? '';

    // Bước 3: Trích xuất và giải mã URL từ HTML
    const rawURLs = Array.from(currentHTML.matchAll(/https?:\/\/[^\s"'>)]+/g)).map(m => m[0]);
    const decodedURLs = rawURLs.map(url => decodeURIComponent(url.replace(/&amp;/g, '&')));

    // Bước 4: Trích xuất storagePath từ URL đã giải mã
    const usedStoragePaths = decodedURLs
      .map(url => {
        const match = url.match(/\/o\/([^?]+)\?/);
        return match ? match[1] : null;
      })
      .filter((path): path is string => !!path);

    // Bước 5: Lấy danh sách file mới từ QuillContentComponent
    const newFiles = this.quillContent?.getStoragePaths() ?? [];

    // Bước 6: Xác định các file đã bị xóa khỏi nội dung
    const deletedFiles = oldFiles.filter(file =>
      !usedStoragePaths.includes(file.storagePath)
    );

    // Bước 7: Xóa các file không còn được sử dụng
    deletedFiles.forEach(file => {
      this.afStorage.ref(file.storagePath).delete().subscribe({
        next: () => console.log('Deleted unused file:', file.storagePath),
        error: err => console.warn('Failed to delete file:', file.storagePath, err)
      });
    });

    // Bước 8: Cập nhật lại danh sách file mới vào form
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(newFiles));

    // Bước 9: Gửi dữ liệu cập nhật
    const updatedCarousel = this.form.value;

    this.carouselService.updateCarousel(this.carouselId, updatedCarousel).subscribe({
      next: (res) => {
        if (res.message === 'update_success') {
          const dialogRef = this.dialog.open(DialogDeleteComponent, {
            width: '400px',
            data: {
              message: 'Bạn đã cập nhật bản ghi thành công! Bạn có muốn quay về trang quản lý không?',
              color: 'blue'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.router.navigate(['/create-carousel'])
            }
          });
        }
      },
      error: err => {
        console.error('Update failed', err);
      }
    });
  }

  comeBackManage() {
    this.router.navigate(['/create-carousel'])
  }
}
