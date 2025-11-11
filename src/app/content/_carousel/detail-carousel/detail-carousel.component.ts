import {Component, Input, OnInit} from '@angular/core';
import {CarouselItem} from "../../../model/CarouselItem";
import {ActivatedRoute, Router} from "@angular/router";
import {CarouselService} from "../../../service/carousel.service";

@Component({
  selector: 'app-detail-carousel',
  templateUrl: './detail-carousel.component.html',
  styleUrls: ['./detail-carousel.component.css']
})
export class DetailCarouselComponent implements OnInit {
  @Input() carouselItem!: CarouselItem;
  constructor(private route: ActivatedRoute,
              private carouselService: CarouselService,) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carouselService.getCarouselById(+id).subscribe(data => {
        this.carouselItem = data;
      });
    }
  }
}
