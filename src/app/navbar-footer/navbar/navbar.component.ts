import {Component, ElementRef, ViewChild} from '@angular/core';
import {TokenService} from "../../service/token.service";
import {SongService} from "../../service/song.service";
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  name = '';
  avatar = '';
  checkLogin = false;
  search ?: string;
  isMenuOpen = false;


  constructor(private tokenService: TokenService,
              private songService: SongService) {
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.name = this.tokenService.getName();
      this.avatar = this.tokenService.getAvatar();
      this.checkLogin = true;
    }
  }
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  selectedFood = this.foods[2].value;
  logOut() {
    sessionStorage.clear();
    window.location.reload();
  }

  // @ts-ignore
  @ViewChild('menuIcon') menuIcon: ElementRef;
  // @ts-ignore
  @ViewChild('navbar') navbar: ElementRef;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuIcon.nativeElement.classList.toggle('bx-x');
    this.navbar.nativeElement.classList.toggle('open');
  }

  searchSong() {
    console.log("this search     -->", this.search)
    // @ts-ignore
    this.songService.setValue(this.search)
  }
}
