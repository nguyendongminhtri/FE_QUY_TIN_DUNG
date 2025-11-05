import {Component} from '@angular/core';
import {CarouselItem} from "../../../model/CarouselItem";
import {CarouselService} from "../../../service/carousel.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  constructor(private carouselService: CarouselService) {
  }
  status = '';
  form: any = {};
  carousel?: CarouselItem;

  onUpload($event: string) {
    this.form.imageUrl = $event;
    console.log('imageUrl --> ', this.form.imageUrl);
  }

  createCarousel() {
      this.carousel = new CarouselItem(
      this.form.title,
      this.form.description,
      this.form.content,
      this.form.imageUrl,
    )
    console.log('this.carousel --> ', this.carousel)
    this.carouselService.createCarousel(this.carousel).subscribe(data =>{
      if(data.message === "success"){
        this.status = 'Thêm Tin Tức HOT thành công';
      }
    })
  }
}
