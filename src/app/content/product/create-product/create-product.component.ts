import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UploadAvatarComponent} from "../../../upload/upload-avatar/upload-avatar.component";
import {QuillContentComponent} from "../../../upload/quill/quill-content/quill-content.component";
import {CategoryService} from "../../../service/category.service";
import {MatDialog} from "@angular/material/dialog";
import {ResetOnDestroy} from "../../../config/ResetOnDestroy";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../model/Category";
import {News} from "../../../model/News";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {ListProductComponent} from "../list-product/list-product.component";
import {ProductService} from "../../../service/product.service";
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy  {
  @ViewChild('uploadAvatar', {static: false}) uploadAvatar!: UploadAvatarComponent;
  @ViewChild('listProduct') listProduct!: ListProductComponent;
  @ViewChild('quillContent') quillContent!: QuillContentComponent;

  constructor(private categoryService: CategoryService,
              private dialog: MatDialog,
              private productService: ProductService,
              private resetOnDestroy: ResetOnDestroy,) {
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
  product?: Product;
  isCreated = false;

  createProduct() {
    this.isCreated = true;
    const quillPaths = this.quillContent.getStoragePaths();
    this.form.get('contentStoragePathsJson')?.setValue(JSON.stringify(quillPaths));
    const formValue = this.form.value;
    this.product = {
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      imageUrl: formValue.imageUrl,
      imageStoragePath: formValue.imageStoragePath,
      contentStoragePathsJson: formValue.contentStoragePathsJson,
      category: {id: formValue.categoryId}   // 👈 sửa chỗ này
    } as News;
    console.log('this.news --> ', this.product);
    this.productService.createProduct(this.product).subscribe(data => {
      if (data.message === 'create_success') {
        this.status = 'Thêm mới Sản phẩm - Dịch vụ thành công!'
        this.listProduct.loadProduct();
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
        this.createProduct();
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
      this.listCategories = this.listCategories.filter(c => c.type === 'product');
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
  // 👇 cleanup logic giống Update
  ngOnDestroy() {
    this.resetOnDestroy.cleanupUnusedFiles(this.isCreated, this.quillContent, this.form);
  }
}
