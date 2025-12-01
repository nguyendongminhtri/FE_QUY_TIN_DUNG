import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../model/Category";
import {IntroduceService} from "../../service/introduce.service";
import {Introduce} from "../../model/Introduce";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // @ts-ignore
  @ViewChild('menuIcon') menuIcon: ElementRef;
  // @ts-ignore
  @ViewChild('navbar') navbar: ElementRef;
  name = '';
  avatar = '';
  checkLogin = false;
  isMenuOpen = false;
  listCategoriesNews: Category[] | undefined;
  listCategoriesStorySuccess: Category[] | undefined;
  listIntroduce?: Introduce[];
  constructor(private tokenService: TokenService,
              private introduceService: IntroduceService,
              private categoryService: CategoryService,) {
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.name = this.tokenService.getName();
      this.avatar = this.tokenService.getAvatar();
      this.checkLogin = true;
    }
    this.categoryService.getListCategoryService().subscribe(data=>{
      // @ts-ignore
      this.listCategoriesNews = data.filter(c => c.type === 'news');      // @ts-ignore
      this.listCategoriesStorySuccess = data.filter(c => c.type === 'story');
    })
    this.introduceService.getListIntroduce().subscribe(data=>{
      this.listIntroduce = data;
    })
  }
  logOut() {
    sessionStorage.clear();
    window.location.reload();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuIcon.nativeElement.classList.toggle('bx-x');
    this.navbar.nativeElement.classList.toggle('open');
  }

}
