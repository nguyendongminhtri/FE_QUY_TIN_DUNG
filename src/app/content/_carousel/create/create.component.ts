import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CarouselItem } from '../../../model/CarouselItem';
import { CarouselService } from '../../../service/carousel.service';
import { ListCrouselComponent } from '../list-crousel/list-crousel.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  @ViewChild('listCarousel') listCarousel!: ListCrouselComponent;

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    content: new FormControl(''),
    imageUrl: new FormControl('')
  });

  status = '';
  carousel?: CarouselItem;

  constructor(private carouselService: CarouselService) {}

  onUpload(imageUrl: string) {
    this.form.get('imageUrl')?.setValue(imageUrl);
  }

  createCarousel() {
    this.carousel = this.form.value as CarouselItem;

    console.log('this.carousel --> ', this.carousel);

    this.carouselService.createCarousel(this.carousel).subscribe(data => {
      if (data.message === 'success') {
        this.status = 'Thêm Tin Tức HOT thành công';
        this.listCarousel.loadCarousel();
      }
    });
  }
}
