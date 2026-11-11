import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../model/Category";
import {IntroduceService} from "../../service/introduce.service";
import {Introduce} from "../../model/Introduce";
import {AuthService} from "../../service/auth.service";
import {Subscription} from "rxjs";
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
  listCategoriesProduct: Category[] | undefined;
  listIntroduce?: Introduce[];
  isAdmin = false;
  private avatarSub?: Subscription;
  constructor(private tokenService: TokenService,
              private introduceService: IntroduceService,
              private categoryService: CategoryService,
              private authService: AuthService,) {
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.name = this.tokenService.getName();
      this.checkLogin = true;
    }
    // MỚI: avatar tự cập nhật mỗi khi TokenService.setAvatar được gọi
    this.avatarSub = this.tokenService.avatar$.subscribe(a => {
      this.avatar = this.authService.getAvatarUrl(a);
    });

    this.categoryService.getListCategoryService().subscribe(data=>{
      this.listCategoriesNews = data.filter((c: Category) => c.type === 'news');
      this.listCategoriesStorySuccess = data.filter((c: Category) => c.type === 'story');
      this.listCategoriesProduct = data.filter((c: Category) => c.type === 'product');
      console.log('product', this.listCategoriesProduct)
    })
    this.introduceService.getListIntroduce().subscribe(data=>{
      this.listIntroduce = data;
    })
    const roles: any[] = this.tokenService.getRole() || [];
    this.isAdmin = roles.some(r => (r?.authority ?? r) === 'ADMIN');
  }
  logOut() {
    sessionStorage.clear();
    this.tokenService.setAvatar(null);
    window.location.reload();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuIcon.nativeElement.classList.toggle('bx-x');
    this.navbar.nativeElement.classList.toggle('open');
  }

  ngOnDestroy(): void {
    this.avatarSub?.unsubscribe();
  }

}
