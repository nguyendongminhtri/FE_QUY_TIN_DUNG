import {Component, OnInit, OnDestroy } from '@angular/core';
import { CarouselItem } from 'src/app/model/CarouselItem';
import {TokenService} from "../../../service/token.service";
import {CarouselService} from "../../../service/carousel.service";
import { Router} from "@angular/router";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  items: CarouselItem[] = [];
  activeIndex = 0;
  intervalId: any;
  isAdminRole: boolean = false;
  constructor(private tokenService: TokenService,
              private crouselService: CarouselService,
              private router: Router) {
  }
  ngOnInit() {
    this.isAdminRole = this.tokenService.getAdminRole();
    console.log('ISaDMIN', this.isAdminRole);
    this.crouselService.getListCarousel().subscribe(carouselList => {
      this.items = carouselList.filter((item: CarouselItem) => item.isShow === true);
      console.log('this.items', this.items);
    });
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  next() {
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
  }
  goToDetail(item: CarouselItem) {
    this.router.navigate(['/carousel-detail', item.id]);
  }
}
