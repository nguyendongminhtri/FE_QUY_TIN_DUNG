import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenService} from "../../../service/token.service";
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../model/Category";
import {News} from "../../../model/News";
import {NewsService} from "../../../service/news.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-page-news',
  templateUrl: './page-news.component.html',
  styleUrls: ['./page-news.component.css']
})
export class PageNewsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  isAdminRole: boolean = false;
  listCategories: Category[] = [];
  showSearch: boolean = false;
  totalElements: number = 0;
  categoryNewsMap: { [key: number]: News[] } = {};
  categoryTotalMap: { [key: number]: number } = {};
  isSearch: boolean = false;

  constructor(private tokenService: TokenService,
              private categoryService: CategoryService,
              private newsService: NewsService,
              private router: Router,) {
  }

  ngOnInit(): void {
    const size = this.paginator?.pageSize || 3;
    this.isAdminRole = this.tokenService.getAdminRole();
    this.showSearch = this.router.url.includes('/page-news');
    this.categoryService.getListCategoryService().subscribe(categoryList => {
      this.listCategories = categoryList;
      this.listCategories.forEach(ctg => {
        this.getPageRequest(ctg.id, {page: 0, size});
      });
    })
  }

  getPageRequest(categoryId: any, request: any) {
    this.newsService.getPageNewsByCategoryId(categoryId, request).subscribe(data => {
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  searchAll(keyword: string) {
    const size = this.paginator?.pageSize || 3;
    if (!keyword) {
      this.isSearch = false;
      // Nếu không nhập gì thì load lại mặc định
      this.listCategories.forEach(ctg => {
        this.getPageRequest(ctg.id, {page: 0, size});
      });
      return;
    }

    this.listCategories.forEach(ctg => {
      const request = {page: 0, size, keyword: keyword};
      this.getPageSearch(ctg.id, request);
    });
  }

  getPageSearch(categoryId: any, request: any) {
    this.newsService.searchNewsByCategory(categoryId, request).subscribe(data => {
      this.isSearch = true;
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  nextPage(categoryId: any, $event: PageEvent) {
    const request = {
      page: $event.pageIndex,
      size: $event.pageSize
    };
    if (this.isSearch) {
      this.getPageSearch(categoryId, request)
    } else {
      this.getPageRequest(categoryId, request);
    }
  }
}
