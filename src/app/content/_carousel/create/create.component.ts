import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CarouselItem} from '../../../model/CarouselItem';
import {CarouselService} from '../../../service/carousel.service';
import {ListCrouselComponent} from '../list-crousel/list-crousel.component';
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {UploadAvatarComponent} from "../../../upload/upload-avatar/upload-avatar.component";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
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

  constructor(private carouselService: CarouselService,
              private dialog: MatDialog) {
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

}
