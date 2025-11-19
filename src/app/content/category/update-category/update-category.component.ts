import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../../model/Category";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../../service/category.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ListCategoryComponent} from "../list-category/list-category.component";

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit{
  status = '';
  // @ts-ignore
  category = new Category();
@ViewChild('listCategory') listCategory?: ListCategoryComponent;
  constructor(private categoryService: CategoryService,
              public dialogRef: MatDialogRef<UpdateCategoryComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any) {
  }
  updateCategory() {
    this.categoryService.updateCategory(this.category?.id?? 0, this.category).subscribe(data =>{
      console.log('data UPDATE ========================>', data)
      if(data.message == 'name_exist'){
        this.status ='Tên thể loại đã tồn tại!'
      } else if(data.message == 'update_success'){
        this.status = 'Cập nhật Thể Loại thành công!'
        // this.dialogRef.close('updated');
      }
    })
  }

  ngOnInit(): void {
    console.log('data tu inject --->', this.data.dataKey)
    this.categoryService.getCategoryById(this.data.dataKey).subscribe(data =>{
      this.category = data;
      console.log('category OLD -------------------- --->', this.category)
    })
  }
}
