import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../model/Category";
import {ListCrouselComponent} from "../../_carousel/list-crousel/list-crousel.component";
import {ListCategoryComponent} from "../list-category/list-category.component";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  status = "";
  form: any = {};
  category? : Category;
  @ViewChild('listCategory') listCategory!: ListCategoryComponent;
  constructor(private categoryService : CategoryService) {
  }
  ngOnInit(): void {

  }
  onNameChange(value: string) {
    if (value && value.trim().length > 0) {
      this.status = '';
    }
  }

  createCategory() {
    this.category = new  Category(
      this.form.name,
      this.form.type
    )
      this.categoryService.createCategoryService(this.category).subscribe(data =>{
        if (data.message=='name_exist'){
          this.status = 'Tên Thể loại đã tồn tại'
        }else {
          this.status = 'Tạo thể loại thành công';
          this.listCategory.loadCategory();
        }
      })
    }
}
