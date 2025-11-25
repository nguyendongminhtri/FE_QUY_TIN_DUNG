import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";
import {NewsService} from "../../../service/news.service";
import {News} from "../../../model/News";

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.css']
})
export class DetailCategoryComponent implements OnInit {
  category?: Category;
  categoryNewsMap: { [key: number]: News[] } = {};
  categoryTotalMap: { [key: number]: number } = {};
  isSearch = false;
  constructor(private act: ActivatedRoute,
              private categoryService:CategoryService,
              private newsService:NewsService
  ) {
  }
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  ngOnInit(): void {
    this.act.paramMap.subscribe(categoryId =>{
      // @ts-ignore
      const id = +categoryId.get('id');
      // lấy pageSize từ paginator nếu có, mặc định 3
      const size = this.paginator?.pageSize || 3;
      this.categoryService.getCategoryById(id).subscribe(data =>{
        this.category = data;
        this.getPageRequest( this.category?.id, {page:0, size});
      })
    })
  }
  getPageRequest(categoryId: any, request: any) {
    this.newsService.getPageNewsByCategoryId(categoryId, request).subscribe(data => {
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }
  // searchNews(keyword: string) {
  //   if (!keyword || !this.category?.id) {
  //     // Nếu không nhập gì thì load lại mặc định
  //     this.getPageRequest(this.category?.id, {page:0, size:5});
  //     return;
  //   }
  //
  //   const request = { page: 0, size: 3, keyword: keyword };
  //   this.newsService.searchNews({
  //     keyword: keyword,
  //    request
  //   }).subscribe(data => {
  //     if (this.category && this.category.id) {
  //       this.categoryNewsMap[this.category.id] = data['content'];
  //       this.categoryTotalMap[this.category.id] = data['totalElements'];
  //     }
  //   });
  // }


  nextPage(categoryId: any, $event: PageEvent) {
    const request = {
      page: $event.pageIndex,
      size: $event.pageSize
    };
    (this.isSearch)? this.getPageSearch(categoryId, request): this.getPageRequest(categoryId,request);
  }

  searchNews(keyword: string) {
    const size = this.paginator?.pageSize || 3;
    if (!keyword) {
      this.isSearch = false;
      // Nếu không nhập gì thì load lại mặc định
        this.getPageRequest(this.category?.id, {page: 0, size});
      return;
    }
    // lấy pageSize từ paginator nếu có, mặc định 3

      const request = {page: 0, size, keyword: keyword};
      this.getPageSearch(this.category?.id, request);
  }
  getPageSearch(categoryId: any, request: any) {
    this.newsService.searchNewsByCategory(categoryId, request).subscribe(data => {
      this.isSearch = true;
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }
}
