import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {MatDialog} from "@angular/material/dialog";
import {NewsService} from "../../../service/news.service";
import {ResetOnDestroy} from "../../../config/ResetOnDestroy";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {ListIntroduceComponent} from "../list-introduce/list-introduce.component";
import {Introduce} from "../../../model/Introduce";
import {IntroduceService} from "../../../service/introduce.service";

@Component({
  selector: 'app-create-introduce',
  templateUrl: './create-introduce.component.html',
  styleUrls: ['./create-introduce.component.css']
})
export class CreateIntroduceComponent implements OnInit, OnDestroy {
  @ViewChild('listIntroduce') listIntroduce!: ListIntroduceComponent;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;
  constructor(
              private dialog: MatDialog,
              private introduceService: IntroduceService,
              private resetOnDestroy: ResetOnDestroy,) {
  }

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl(''),
    contentStoragePathsJson: new FormControl(''),
  });
  status = '';
  introduce?: Introduce;
  isCreated = false;
  createNews() {
    this.isCreated = true;
    const quillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(quillPaths));
    const formValue = this.form.value;
    this.introduce = {
      title: formValue.title,
      content: formValue.content,
      contentStoragePathsJson: formValue.contentStoragePathsJson,
    } as Introduce;
    this.introduceService.createIntroduce(this.introduce).subscribe(data => {
      if (data.message === 'create_success') {
        this.status = 'Thêm mới tin tức thành công!'
        this.listIntroduce.loadIntroduce();
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

  ngOnInit(): void {
    // Lắng nghe thay đổi của title
    this.form.get('title')?.valueChanges.subscribe(value => {
      if (value && this.status) {
        this.status = '';
      }
    });
  }
  resetForm() {
    this.form.reset();
    this.form.get('content')?.setValue('');
    this.quillContent.clearContent();
  }
  // 👇 cleanup logic giống Update
  ngOnDestroy() {
    this.resetOnDestroy.cleanupUnusedFiles(this.isCreated, this.quillContent, this.form);
  }
}
