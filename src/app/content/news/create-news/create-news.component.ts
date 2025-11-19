import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";
import {UploadAvatarComponent} from "../../../upload/upload-avatar/upload-avatar.component";
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {News} from "../../../model/News";
import {NewsService} from "../../../service/news.service";
import {ListNewsComponent} from "../list-news/list-news.component";

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {
  @ViewChild('uploadAvatar', {static: false}) uploadAvatar!: UploadAvatarComponent;
  @ViewChild('listNews') listNews!: ListNewsComponent;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;
  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private newsService: NewsService,) {
  }

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    content: new FormControl(''),
    imageUrl: new FormControl('', Validators.required),
    imageStoragePath: new FormControl(''),
    contentStoragePathsJson: new FormControl(''),
    categoryId: new FormControl('', Validators.required)
  });
  status = '';
  listCategories: Category[] = [];
  news?: News;
  createNews() {
    const quillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(quillPaths));
    const formValue = this.form.value;
    this.news = {
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      imageUrl: formValue.imageUrl,
      imageStoragePath: formValue.imageStoragePath,
      contentStoragePathsJson: formValue.contentStoragePathsJson,
      category: { id: formValue.categoryId }   // 👈 sửa chỗ này
    } as News;
    console.log('this.news --> ', this.news);
    this.newsService.createNews(this.news).subscribe(data => {
      if (data.message === 'create_success') {
        this.status = 'Thêm mới tin tức thành công!'
        this.listNews.loadNews();
      }
    });
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {
        message: 'Bạn có muốn thêm mới bản ghi?',
        color: 'green'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNews();
        this.resetForm();
      }
    });
  }

  onUpload(fileInfo: { downloadURL: string; storagePath: string }) {
    this.form.get('imageUrl')?.setValue(fileInfo.downloadURL);
    this.form.get('imageStoragePath')?.setValue(fileInfo.storagePath);
  }

  ngOnInit(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategories = data;
    })
    // Lắng nghe thay đổi của title
    this.form.get('title')?.valueChanges.subscribe(value => {
      if (value && this.status) {
        this.status = '';
      }
    });

    // Lắng nghe thay đổi của imageUrl
    this.form.get('imageUrl')?.valueChanges.subscribe(value => {
      if (value && this.status) {
        this.status = '';
      }
    });
    // Lắng nghe thay đổi của description
    this.form.get('description')?.valueChanges.subscribe(value => {
      if (value && this.status) {
        this.status = '';
      }
    });
  }
  resetForm() {
    this.form.reset();
    this.form.get('content')?.setValue('');
    this.quillContent.clearContent();
    this.uploadAvatar.reset();
  }
}
