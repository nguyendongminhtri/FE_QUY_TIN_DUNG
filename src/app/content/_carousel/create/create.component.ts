import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CarouselItem} from '../../../model/CarouselItem';
import {CarouselService} from '../../../service/carousel.service';
import {ListCrouselComponent} from '../list-crousel/list-crousel.component';
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {UploadAvatarComponent} from "../../../upload/upload-avatar/upload-avatar.component";
import {FirebaseStorageService} from "../../../service/firebase-storage.service";
import {ResetOnDestroy} from "../../../config/ResetOnDestroy";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  @ViewChild('uploadAvatar', {static: false}) uploadAvatar!: UploadAvatarComponent;
  @ViewChild('listCarousel') listCarousel!: ListCrouselComponent;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    content: new FormControl(''),
    imageUrl: new FormControl('', Validators.required),
    imageStoragePath: new FormControl(''),
    contentStoragePathsJson: new FormControl('')
  });
  status = '';
  carousel?: CarouselItem;
  contentStoragePathsJson: string[] = [];
  isCreated = false;
  constructor(private carouselService: CarouselService,
              private dialog: MatDialog,
              private resetOnDestroy: ResetOnDestroy) {
  }

  ngOnInit(): void {
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
  }

  onUpload(fileInfo: { downloadURL: string; storagePath: string }) {
    this.form.get('imageUrl')?.setValue(fileInfo.downloadURL);
    this.form.get('imageStoragePath')?.setValue(fileInfo.storagePath);
  }

  createCarousel() {
    this.isCreated = true;
    const quillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(quillPaths));
    this.carousel = this.form.value as CarouselItem;
    console.log('this.carousel --> ', this.carousel);
    this.carouselService.createCarousel(this.carousel).subscribe(data => {
      if (data.message === 'success') {
        this.status = 'Thêm mới tin tức HOT thành công!'
        this.listCarousel.loadCarousel();
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
        this.createCarousel();
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.form.get('content')?.setValue('');
    this.quillContent.clearContent();
    this.uploadAvatar.reset();
  }
  ngOnDestroy() {
    // if (!this.isCreated) {
    //   const uploadedPaths = [
    //     ...this.quillContent.getStoragePaths().map(f => f.storagePath),
    //   ];
    //
    //   const newAvatarPath = this.form.get('imageStoragePath')?.value;
    //   if (newAvatarPath) {
    //     uploadedPaths.push(newAvatarPath);
    //   }
    //
    //   if (uploadedPaths.length > 0) {
    //     this.firebaseStorageService.deleteMultipleFilesByPaths(uploadedPaths)
    //       .then(() => console.log('Đã dọn file chưa dùng khi thoát CreateNewsComponent'));
    //   }
    // }
    this.resetOnDestroy.cleanupUnusedFiles(this.isCreated, this.quillContent, this.form);
  }

}
