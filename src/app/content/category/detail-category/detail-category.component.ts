import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.css']
})
export class DetailCategoryComponent {
  category?: Category;

  constructor(private act: ActivatedRoute,
              public dialog: MatDialog,
              private categoryService:CategoryService,
  ) {
  }
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  ngOnInit(): void {
    // if (this.tokenService.getToken()) {
    //   console.log('role ---->', this.tokenService.getRole())
    //   if (JSON.stringify(this.tokenService.getRole()) == JSON.stringify(['ADMIN'])) {
    //     this.checkUserAdmin = true;
    //   }
    //   //  console.log('role -->', this.tokenService.getRole())
    //   // if(JSON.stringify(this.tokenService.getRole())==JSON.stringify(['ADMIN'])){
    //   //   this.checkUserAdmin = true;
    //   // }
    //   // this.checkUserLogin = true;
    // }
    this.act.paramMap.subscribe(categoryId =>{
      // @ts-ignore
      const id = +categoryId.get('id');
      this.categoryService.getCategoryById(id).subscribe(data =>{
        this.category = data;
      })
    })
  }

}
