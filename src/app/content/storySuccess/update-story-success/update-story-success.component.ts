import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../model/Category";
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {News} from "../../../model/News";
import {ActivatedRoute, Router} from "@angular/router";
import {NewsService} from "../../../service/news.service";
import {MatDialog} from "@angular/material/dialog";
import {CategoryService} from "../../../service/category.service";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {ResetOnDestroy} from "../../../config/ResetOnDestroy";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {StorySuccess} from "../../../model/StorySuccess";
import {StorySuccessService} from "../../../service/story-success.service";

@Component({
  selector: 'app-update-story-success',
  templateUrl: './update-story-success.component.html',
  styleUrls: ['./update-story-success.component.css']
})
export class UpdateStorySuccessComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  currentImageUrl: string = '';
  newsId!: string;
  listCategories?: Category[] = [];
  private isUpdated = false;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;
  oldStorySuccess?: StorySuccess;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storySuccessService: StorySuccessService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private firebaseStorageService: FirebaseStorageService,
    private resetOnDestroy: ResetOnDestroy
  ) {}

  ngOnInit(): void {
    this.newsId = this.route.snapshot.paramMap.get('id') ?? '';

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      imageUrl: ['', Validators.required],
      imageStoragePath: [''],
      contentStoragePathsJson: [JSON.stringify([])],
      categoryId: ['', Validators.required]
    });

    if (this.newsId) {
      this.storySuccessService.getStorySuccessById(+this.newsId).subscribe(data => {
        this.form.patchValue({
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.imageUrl,
          imageStoragePath: data.imageStoragePath,
          categoryId: data.category?.id
        });
        this.oldStorySuccess = data;
        this.currentImageUrl = data.imageUrl?? '';
      });
    }

    this.categoryService.getListCategoryService().subscribe(data => {
      // @ts-ignore
      this.listCategories = data.filter(c=> c.type === 'story');
    });
  }
  status = '';
  onUpload(event: { downloadURL: string; storagePath: string }) {
    this.form.patchValue({
      imageUrl: event.downloadURL,
      imageStoragePath: event.storagePath
    });
  }

  onUpdate() {
    this.isUpdated = true;
    // Lấy danh sách file từ Quill editor (mới)
    const newQuillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(newQuillPaths));

    const formValue = this.form.value;
    const updatedNews: News = {
      id: this.oldStorySuccess?.id,
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      imageUrl: formValue.imageUrl,
      imageStoragePath: formValue.imageStoragePath,
      contentStoragePathsJson: formValue.contentStoragePathsJson,
      category: { id: formValue.categoryId }
    };

    let oldPathsRaw = this.oldStorySuccess?.contentStoragePathsJson || '[]';
    let parsed: any;

    try {
      parsed = JSON.parse(oldPathsRaw);
      // Nếu parse ra vẫn là string, parse thêm lần nữa
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
    } catch (e) {
      parsed = [];
    }

    console.log('parsed after normalize', parsed);
    let oldPaths: string[] = Array.isArray(parsed)
      ? parsed.map((item: any) => item.storagePath)
      : [];
    console.log('oldPaths', oldPaths);

    // Chuẩn hóa newPaths thành string[]
    let newPaths: string[] = Array.isArray(newQuillPaths)
      ? newQuillPaths.map((item: any) => item.storagePath)
      : [];


    console.log('newPaths', newPaths);

    // Tìm file cần xóa
    const filesToDelete = oldPaths.filter(p => !newPaths.includes(p));
    console.log('filesToDelete', filesToDelete);

    // Kiểm tra avatar ngoài có thay đổi không
    const imageChanged = this.oldStorySuccess?.imageStoragePath !== updatedNews.imageStoragePath;

    const deletePromises: Promise<void>[] = [];
    if (imageChanged && this.oldStorySuccess?.imageStoragePath) {
      deletePromises.push(this.firebaseStorageService.deleteFileByPath(this.oldStorySuccess.imageStoragePath));
    }
    if (filesToDelete.length > 0) {
      deletePromises.push(this.firebaseStorageService.deleteMultipleFilesByPaths(filesToDelete));
    }

    // Sau khi xóa file cũ thì gọi API update
    Promise.all(deletePromises).then(() => {
      this.storySuccessService.updateStorySuccess(updatedNews.id!, updatedNews).subscribe({
        next: (data) => {
          if(data.message === 'update_success'){
            const dialogRef = this.dialog.open(DialogDeleteComponent, {
              width: '400px',
              data: {
                message: 'Bạn đã cập nhật bản ghi thành công! Bạn có muốn quay về trang quản lý không?',
                color: 'blue'
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.router.navigate(['/create-story-success']);
              }
            });
          }
        },
        error: () => console.log('Update failed!')
      });
    });
  }


  onCancel() {
    if (!this.isUpdated) {
      const uploadedPaths = [
        ...this.quillContent.getStoragePaths().map(f => f.storagePath),
      ];

      // kiểm tra avatar ngoài
      const newAvatarPath = this.form.get('imageStoragePath')?.value;
      if (newAvatarPath && newAvatarPath !== this.oldStorySuccess?.imageStoragePath) {
        uploadedPaths.push(newAvatarPath);
      }

      if (uploadedPaths.length > 0) {
        this.firebaseStorageService.deleteMultipleFilesByPaths(uploadedPaths)
          .then(() => {
            this.router.navigate(['/create-story-success']);
          });
      } else {
        this.router.navigate(['/create-story-success']);
      }
    }
    this.router.navigate(['/create-story-success']);
  }
  onStoragePathsChange(paths: { downloadURL: string; storagePath: string }[]) {
    console.log('get storage paths:', paths);
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(paths));
  }


  ngOnDestroy() {
    this.resetOnDestroy.cleanupUnusedFiles(this.isUpdated, this.quillContent, this.form);
  }
}
