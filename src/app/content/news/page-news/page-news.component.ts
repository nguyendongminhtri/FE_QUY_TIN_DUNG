import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenService} from "../../../service/token.service";
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../model/Category";
import {Singer} from "../../../model/Singer";
import {News} from "../../../model/News";
import {NewsService} from "../../../service/news.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-page-news',
  templateUrl: './page-news.component.html',
  styleUrls: ['./page-news.component.css']
})
export class PageNewsComponent implements OnInit{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  isAdminRole: boolean = false;
  listCategories: Category[] = [];
  newsList?: News[];
  totalElements: number=0;
  dataSource: any;
  categoryNewsMap: { [key: number]: News[] } = {};
  categoryTotalMap: { [key: number]: number } = {};
  constructor(private tokenService: TokenService,
              private categoryService: CategoryService,
              private newsService: NewsService,) {
  }
    ngOnInit(): void {
        this.isAdminRole = this.tokenService.getAdminRole();
        this.categoryService.getListCategoryService().subscribe(categoryList => {
          this.listCategories = categoryList;
          this.listCategories.forEach(ctg => {
            this.getPageRequest( ctg.id, {page:0,size:5});
          });
        })
    }
  getPageRequest(categoryId: any, request: any) {
    this.newsService.getPageNewsByCategoryId(categoryId, request).subscribe(data => {
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  nextPage(categoryId: any, $event: PageEvent) {
    const request = {
      page: $event.pageIndex,
      size: $event.pageSize
    };
    this.getPageRequest( categoryId,request);
  }
}
