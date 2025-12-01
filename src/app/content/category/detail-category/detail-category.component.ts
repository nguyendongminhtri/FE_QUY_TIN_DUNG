import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category.service";
import {NewsService} from "../../../service/news.service";
import {News} from "../../../model/News";
import {StorySuccessService} from "../../../service/story-success.service";
import {StorySuccess} from "../../../model/StorySuccess";
import {ProductService} from "../../../service/product.service";
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.css']
})
export class DetailCategoryComponent implements OnInit {
  category?: Category;
  categoryNewsMap: { [key: number]: News[] } = {};
  categoryTotalMap: { [key: number]: number } = {};
  categoryStorySuccessMap: { [key: number]: StorySuccess[] } = {};
  categoryProductMap: { [key: number]: Product[] } = {};
  isSearch = false;

  constructor(private act: ActivatedRoute,
              private categoryService: CategoryService,
              private newsService: NewsService,
              private storySuccessService: StorySuccessService,
              private productService: ProductService,
  ) {
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngOnInit(): void {
    this.act.paramMap.subscribe(categoryId => {
      // @ts-ignore
      const id = +categoryId.get('id');
      // lấy pageSize từ paginator nếu có, mặc định 3
      const size = this.paginator?.pageSize || 3;
      this.categoryService.getCategoryById(id).subscribe(data => {
        this.category = data;
        if (this.category?.type === 'news') {
          this.getPageRequestNews(this.category?.id, {page: 0, size});
        } else if (this.category?.type === 'story') {
          this.getPageRequestStorySuccess(this.category?.id, {page: 0, size});
        } else if (this.category?.type === 'product') {
          this.getPageRequestProduct(this.category?.id, {page: 0, size});
        }
      })
    })
  }

  getPageRequestNews(categoryId: any, request: any) {
    this.newsService.getPageNewsByCategoryId(categoryId, request).subscribe(data => {
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  getPageRequestStorySuccess(categoryId: any, request: any) {
    this.storySuccessService.getPageStorySuccessByCategoryId(categoryId, request).subscribe(data => {
      this.categoryStorySuccessMap[categoryId] = data['content'];
      console.log('this.categoryStorySuccessMap[categoryId]', this.categoryStorySuccessMap[categoryId].length);
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }
  getPageRequestProduct(categoryId: any, request: any) {
    this.productService.getPageProductByCategoryId(categoryId, request).subscribe(data => {
      this.categoryProductMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  nextPage(categoryId: any, $event: PageEvent) {
    const request = {
      page: $event.pageIndex,
      size: $event.pageSize
    };
    if (this.category?.type === 'news') {
      (this.isSearch) ? this.getPageSearchNews(categoryId, request) : this.getPageRequestNews(categoryId, request);
    } else if (this.category?.type === 'story') {
      (this.isSearch) ? this.getPageSearchStorySuccess(categoryId, request) : this.getPageRequestStorySuccess(categoryId, request);
    } else if(this.category?.type === 'product') {
      (this.isSearch) ? this.getPageSearchProduct(categoryId, request) : this.getPageRequestProduct(categoryId, request);
    }
  }

  searchNews(keyword: string) {
    const size = this.paginator?.pageSize || 3;
    if (!keyword) {
      this.isSearch = false;
      console.log('this.type --->', this.category?.type)
      // Nếu không nhập gì thì load lại mặc định
      if (this.category?.type === 'news') {
        this.getPageRequestNews(this.category?.id, {page: 0, size});
      } else if (this.category?.type === 'story') {
        this.getPageRequestStorySuccess(this.category?.id, {page: 0, size});
      } else if (this.category?.type === 'product') {
        this.getPageRequestProduct(this.category?.id, {page: 0, size});
      }
      return;
    }
    // lấy pageSize từ paginator nếu có, mặc định 3

    const request = {page: 0, size, keyword: keyword};
    if (this.category?.type === 'news') {
      this.getPageSearchNews(this.category?.id, request);
    } else if (this.category?.type === 'story') {
      this.getPageSearchStorySuccess(this.category?.id, request);
    } else if (this.category?.type === 'product') {
      this.getPageRequestProduct(this.category?.id, request);
    }
  }

  getPageSearchNews(categoryId: any, request: any) {
    this.newsService.searchNewsByCategory(categoryId, request).subscribe(data => {
      this.isSearch = true;
      this.categoryNewsMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }

  getPageSearchStorySuccess(categoryId: any, request: any) {
    this.storySuccessService.searchStorySuccessByCategory(categoryId, request).subscribe(data => {
      this.isSearch = true;
      this.categoryStorySuccessMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }
  getPageSearchProduct(categoryId: any, request: any) {
    this.productService.searchProductByCategory(categoryId, request).subscribe(data => {
      this.isSearch = true;
      this.categoryStorySuccessMap[categoryId] = data['content'];
      this.categoryTotalMap[categoryId] = data['totalElements'];
    });
  }
}
