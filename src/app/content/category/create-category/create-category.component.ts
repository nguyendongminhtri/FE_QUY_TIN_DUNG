import {Component} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../model/Category";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent {
  status = "";
  form: any = {};
  category? : Category;

  constructor(private categoryService : CategoryService) {
  }

  protected readonly = onunload;
  onUpload($event: string) {
    this.form.avatar = $event;
  }

  updateAvatar() {
    return false;
  }

  createCategory() {
    this.category = new  Category(
      this.form.name,
      this.form.avatar
    )
    if (this.form.avatar == undefined){
      this.status = "Avatar field cannot be empty!"
    }else {
      this.categoryService.createCategoryService(this.category).subscribe(data =>{
        if (data.message=='name_exist'){
          this.status = 'The name is exist'
        }else {
          this.status = 'Create success';
        }
      })
    }
  }
}
