import {Component, OnInit, OnDestroy } from '@angular/core';
import { CarouselItem } from 'src/app/model/CarouselItem';
import {TokenService} from "../../../service/token.service";
import {CarouselService} from "../../../service/carousel.service";

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
              private crouselService: CarouselService,) {
  }
  ngOnInit() {
    const roleUser = this.tokenService.getRole();
    this.isAdminRole = roleUser.includes('ADMIN');
    console.log('ISaDMIN', this.isAdminRole);
    // this.items = [
    //   {
    //     id: 1,
    //     title: 'Ảnh 1',
    //     description: 'Mô tả cho ảnh 1',
    //     imageUrl: 'https://picsum.photos/id/1015/600/300',
    //     content: ''
    //   },
    //   {
    //     id: 2,
    //     title: 'Ảnh 2',
    //     description: 'Mô tả cho ảnh 2',
    //     imageUrl: 'https://picsum.photos/id/1016/600/300',
    //     content: ''
    //   },
    //   {
    //     id: 3,
    //     title: 'Ảnh 3',
    //     description: 'Mô tả cho ảnh 3',
    //     imageUrl: 'https://picsum.photos/id/1018/600/300',
    //     content: ''
    //   }
    // ];
    this.crouselService.getListCarousel().subscribe(carouselList => {
      this.items = carouselList;
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
}
