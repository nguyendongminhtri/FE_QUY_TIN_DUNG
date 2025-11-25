import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {FooterComponent} from './navbar-footer/footer/footer.component';
import {HomeComponent} from './home/home.component';
import {MatCardModule} from "@angular/material/card";
import {RegisterComponent} from './form_login/register/register.component';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './form_login/login/login.component';

import {environment} from "../environments/environment.development";
import {UploadAvatarComponent} from './upload/upload-avatar/upload-avatar.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireModule} from "@angular/fire/compat";
import {ChangeAvatarComponent} from './form_login/change-avatar/change-avatar.component';
import {AuthInterceptor} from "./service/auth.interceptor";
import {ListCategoryComponent} from './content/category/list-category/list-category.component';
import {CreateCategoryComponent} from './content/category/create-category/create-category.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {UpdateCategoryComponent} from './content/category/update-category/update-category.component';
import {DeleteCategoryComponent} from './content/category/delete-category/delete-category.component';
import {PageCategoryComponent} from './content/category/page-category/page-category.component';
import {UploadFileComponent} from './upload/upload-file/upload-file.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {NavbarComponent} from "./navbar-footer/navbar/navbar.component";
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {TextComponent} from './content/text/text.component';
import {CarouselComponent} from './content/_carousel/carousel/carousel.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {CheckLoginGuard} from "./service/CheckLoginGuard";
import {DialogSuccessComponent} from './dialog/dialog-success/dialog-success.component';
import {DetailCategoryComponent} from './content/category/detail-category/detail-category.component';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {CreateComponent} from './content/_carousel/create/create.component';
import {QuillModule} from "ngx-quill";
import { ListCrouselComponent } from './content/_carousel/list-crousel/list-crousel.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { UploadFileQuillComponent } from './upload/quill/upload-file-quill/upload-file-quill.component';
import { QuillContentComponent } from './upload/quill/quill-content/quill-content.component';
import { DialogDeleteComponent } from './dialog/dialog-delete/dialog-delete.component';
import { DetailCarouselComponent } from './content/_carousel/detail-carousel/detail-carousel.component';
import { UpdateCarouselComponent } from './content/_carousel/update-carousel/update-carousel.component';
import {UploadAvartarQuillComponent} from "./upload/quill/upload-avartar-quill/upload-avartar-quill.component";
import { PageNewsComponent } from './content/news/page-news/page-news.component';
import { CreateNewsComponent } from './content/news/create-news/create-news.component';
import { ListNewsComponent } from './content/news/list-news/list-news.component';
import { UpdateNewsComponent } from './content/news/update-news/update-news.component';
import {NoReuseStrategy} from "./config/NoReuseStrategy";
import {RouteReuseStrategy} from "@angular/router";
import { DetailNewsComponent } from './content/news/detail-news/detail-news.component';
import { CreateIntroduceComponent } from './content/introduce/create-introduce/create-introduce.component';
import { ListIntroduceComponent } from './content/introduce/list-introduce/list-introduce.component';
import { UpdateIntroduceComponent } from './content/introduce/update-introduce/update-introduce.component';
import { DetailIntroduceComponent } from './content/introduce/detail-introduce/detail-introduce.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    UploadAvatarComponent,
    ChangeAvatarComponent,
    ListCategoryComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    DeleteCategoryComponent,
    PageCategoryComponent,
    UploadFileComponent,
    TextComponent,
    CarouselComponent,
    DialogSuccessComponent,
    DetailCategoryComponent,
    CreateComponent,
    ListCrouselComponent,
    UploadAvartarQuillComponent,
    UploadFileQuillComponent,
    QuillContentComponent,
    DialogDeleteComponent,
    DetailCarouselComponent,
    UpdateCarouselComponent,
    PageNewsComponent,
    CreateNewsComponent,
    ListNewsComponent,
    UpdateNewsComponent,
    DetailNewsComponent,
    CreateIntroduceComponent,
    ListIntroduceComponent,
    UpdateIntroduceComponent,
    DetailIntroduceComponent,
  ],
  imports: [
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    CdkDrag,
    MatSlideToggleModule
  ],
  exports: [
    QuillContentComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
    CheckLoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
