import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-page-news',
  templateUrl: './page-news.component.html',
  styleUrls: ['./page-news.component.css']
})
export class PageNewsComponent implements OnInit{
  isAdminRole: boolean = false;
  constructor(private tokenService: TokenService,) {
  }
    ngOnInit(): void {
        this.isAdminRole = this.tokenService.getAdminRole();
    }
}
