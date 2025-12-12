import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./form_login/register/register.component";
import {LoginComponent} from "./form_login/login/login.component";
import {ChangeAvatarComponent} from "./form_login/change-avatar/change-avatar.component";
import {PageCategoryComponent} from "./content/category/page-category/page-category.component";
import {CreateCategoryComponent} from "./content/category/create-category/create-category.component";
import {CheckLoginGuard} from "./service/CheckLoginGuard";
import {DetailCategoryComponent} from "./content/category/detail-category/detail-category.component";
import {CheckLogoutGuard} from "./service/CheckLogoutGuard";
import {CreateComponent} from "./content/_carousel/create/create.component";
import {DetailCarouselComponent} from "./content/_carousel/detail-carousel/detail-carousel.component";
import {UpdateCarouselComponent} from "./content/_carousel/update-carousel/update-carousel.component";
import {CreateNewsComponent} from "./content/news/create-news/create-news.component";
import {UpdateNewsComponent} from "./content/news/update-news/update-news.component";
import {DetailNewsComponent} from "./content/news/detail-news/detail-news.component";
import {PageNewsComponent} from "./content/news/page-news/page-news.component";
import {CreateIntroduceComponent} from "./content/introduce/create-introduce/create-introduce.component";
import {DetailIntroduceComponent} from "./content/introduce/detail-introduce/detail-introduce.component";
import {UpdateIntroduceComponent} from "./content/introduce/update-introduce/update-introduce.component";
import {CreateStorySuccessComponent} from "./content/storySuccess/create-story-success/create-story-success.component";
import {UpdateStorySuccessComponent} from "./content/storySuccess/update-story-success/update-story-success.component";
import {DetailStorySuccessComponent} from "./content/storySuccess/detail-story-success/detail-story-success.component";
import {CreateProductComponent} from "./content/product/create-product/create-product.component";
import {UpdateProductComponent} from "./content/product/update-product/update-product.component";
import {DetailProductComponent} from "./content/product/detail-product/detail-product.component";
import {PageStorySuccessComponent} from "./content/storySuccess/page-story-success/page-story-success.component";
import {PageProductComponent} from "./content/product/page-product/page-product.component";
import {ProfileComponent} from "./form_login/profile/profile.component";
import {
  CreateCreditContractComponent
} from "./content/credit-contract/create-credit-contract/create-credit-contract.component";
import {
  ListCreditContractComponent
} from "./content/credit-contract/list-credit-contract/list-credit-contract.component";
import {
  DetailCreaditContractComponent
} from "./content/credit-contract/detail-creadit-contract/detail-creadit-contract.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register' ,component: RegisterComponent, canActivate:[CheckLoginGuard]},
  {path: 'login' ,component:LoginComponent, canActivate:[CheckLoginGuard]},
  {path:'change-avatar',component:ChangeAvatarComponent, canActivate:[CheckLogoutGuard] },
  {path: 'profile', component: ProfileComponent, canActivate:[CheckLogoutGuard] },

  {path:'category',component:PageCategoryComponent},
  {path:'create-category',component:CreateCategoryComponent},
  {path:'detail-category/:id',component:DetailCategoryComponent},

  //Carousel
  {path: 'create-carousel', component: CreateComponent},
  {path: 'carousel-detail/:id', component: DetailCarouselComponent},
  {path: 'carousel-update/:id', component: UpdateCarouselComponent},

  //News
  {path: 'create-news', component: CreateNewsComponent},
  {path: 'news-update/:id', component: UpdateNewsComponent},
  {path: 'news-detail/:id', component: DetailNewsComponent},
  {path: 'page-news', component: PageNewsComponent},

  //Introduce
  {path: 'create-introduce', component: CreateIntroduceComponent},
  {path:'detail-introduce/:id',component:DetailIntroduceComponent},
  {path: 'update-introduce/:id', component: UpdateIntroduceComponent},

  //Story Success
  {path: 'create-story-success', component: CreateStorySuccessComponent},
  {path: 'update-story-success/:id', component: UpdateStorySuccessComponent},
  {path: 'detail-story-success/:id', component: DetailStorySuccessComponent},
  {path: 'page-story-success', component: PageStorySuccessComponent},

  //Product
  {path: 'create-product', component: CreateProductComponent},
  {path: 'update-product/:id', component: UpdateProductComponent},
  {path: 'detail-product/:id', component: DetailProductComponent},
  {path: 'page-product', component: PageProductComponent},

  //credit-contract
  {path: 'create-credit-contract', component: CreateCreditContractComponent},
  {path: 'list-credit-contract', component: ListCreditContractComponent},
  {path: 'credit-contract-update/:id', component: DetailCreaditContractComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
