import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {CarouselItem} from "../../../model/CarouselItem";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {ResetOnDestroy} from "../../../config/ResetOnDestroy";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {IntroduceService} from "../../../service/introduce.service";

@Component({
  selector: 'app-update-introduce',
  templateUrl: './update-introduce.component.html',
  styleUrls: ['./update-introduce.component.css']
})
export class UpdateIntroduceComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  introduceId!: string;
  private isUpdated = false;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;
  oldCarousel?: CarouselItem;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private introduceService: IntroduceService,
    private dialog: MatDialog,
    private firebaseStorageService: FirebaseStorageService,
    private resetOnDestroy: ResetOnDestroy
  ) {}

  ngOnInit(): void {
    this.introduceId = this.route.snapshot.paramMap.get('id') ?? '';

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      contentStoragePathsJson: [JSON.stringify([])]
    });

    if (this.introduceId) {
      this.introduceService.getIntroduceById(+this.introduceId).subscribe(data => {
        this.form.patchValue({
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.imageUrl,
          imageStoragePath: data.imageStoragePath
        });
        this.oldCarousel = data;
      });
    }
  }

  onUpdate() {
    this.isUpdated = true;

    // Lấy danh sách file từ Quill editor (mới)
    const newQuillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(newQuillPaths));

    const formValue = this.form.value;
    const updatedCarousel: CarouselItem = {
      id: this.oldCarousel?.id,
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      imageUrl: formValue.imageUrl,
      imageStoragePath: formValue.imageStoragePath,
      contentStoragePathsJson: formValue.contentStoragePathsJson
    };

    // Parse danh sách file cũ
    let oldPathsRaw = this.oldCarousel?.contentStoragePathsJson || '[]';
    let parsed: any;
    try {
      parsed = JSON.parse(oldPathsRaw);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
    } catch (e) {
      parsed = [];
    }

    let oldPaths: string[] = Array.isArray(parsed)
      ? parsed.map((item: any) => item.storagePath)
      : [];

    // Chuẩn hóa newPaths thành string[]
    let newPaths: string[] = Array.isArray(newQuillPaths)
      ? newQuillPaths.map((item: any) => item.storagePath)
      : [];

    // Tìm file cần xóa
    const filesToDelete = oldPaths.filter(p => !newPaths.includes(p));

    // Kiểm tra avatar ngoài có thay đổi không
    const imageChanged = this.oldCarousel?.imageStoragePath !== updatedCarousel.imageStoragePath;

    const deletePromises: Promise<void>[] = [];
    if (imageChanged && this.oldCarousel?.imageStoragePath) {
      deletePromises.push(this.firebaseStorageService.deleteFileByPath(this.oldCarousel.imageStoragePath));
    }
    if (filesToDelete.length > 0) {
      deletePromises.push(this.firebaseStorageService.deleteMultipleFilesByPaths(filesToDelete));
    }

    // Sau khi xóa file cũ thì gọi API update
    Promise.all(deletePromises).then(() => {
      this.introduceService.updateIntroduce(updatedCarousel.id!, updatedCarousel).subscribe({
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
                this.router.navigate(['/create-introduce']);
              }
            });
          }
        },
        error: () => console.error('Update failed!')
      });
    });
  }

  onCancel() {
    if (!this.isUpdated) {
      const uploadedPaths = [
        ...this.quillContent.getStoragePaths().map(f => f.storagePath),
      ];

      // const newAvatarPath = this.form.get('imageStoragePath')?.value;
      // if (newAvatarPath && newAvatarPath !== this.oldCarousel?.imageStoragePath) {
      //   uploadedPaths.push(newAvatarPath);
      // }

      if (uploadedPaths.length > 0) {
        this.firebaseStorageService.deleteMultipleFilesByPaths(uploadedPaths)
          .then(() => {
            this.router.navigate(['/create-introduce']);
          });
      } else {
        this.router.navigate(['/create-introduce']);
      }
    } else {
      this.router.navigate(['/create-introduce']);
    }
  }

  ngOnDestroy() {
    this.resetOnDestroy.cleanupUnusedFiles(this.isUpdated, this.quillContent, this.form);
  }
}
