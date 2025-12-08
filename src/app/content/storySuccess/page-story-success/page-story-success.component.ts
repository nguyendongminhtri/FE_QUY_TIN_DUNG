import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Category} from "../../../model/Category";
import {News} from "../../../model/News";
import {TokenService} from "../../../service/token.service";
import {CategoryService} from "../../../service/category.service";
import {Router} from "@angular/router";
import {StorySuccessService} from "../../../service/story-success.service";

@Component({
  selector: 'app-page-story-success',
  templateUrl: './page-story-success.component.html',
  styleUrls: ['./page-story-success.component.css']
})
export class PageStorySuccessComponent implements OnInit{
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
              private storySuccessService: StorySuccessService,
              private router: Router,) {
  }

  ngOnInit(): void {
    const size = this.paginator?.pageSize || 3;
    this.isAdminRole = this.tokenService.getAdminRole();
    this.showSearch = this.router.url.includes('/page-story-success');
    this.categoryService.getListCategoryService().subscribe(categoryList => {
      this.listCategories = categoryList;
      this.listCategories = this.listCategories.filter(c => c.type === 'story');
      this.listCategories.forEach(ctg => {
        this.getPageRequest(ctg.id, {page: 0, size});
      });
    })
  }

  getPageRequest(categoryId: any, request: any) {
    this.storySuccessService.getPageStorySuccessByCategoryId(categoryId, request).subscribe(data => {
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
    this.storySuccessService.searchStorySuccessByCategory(categoryId, request).subscribe(data => {
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
