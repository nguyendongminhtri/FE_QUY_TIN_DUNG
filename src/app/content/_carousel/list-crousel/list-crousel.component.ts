import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {CarouselItem} from "../../../model/CarouselItem";
import {CarouselService} from "../../../service/carousel.service";

@Component({
  selector: 'app-list-crousel',
  templateUrl: './list-crousel.component.html',
  styleUrls: ['./list-crousel.component.css']
})
export class ListCrouselComponent implements OnInit {
  listCarousel: CarouselItem[] = [];
  displayedColumns: string[] = ['id', 'title', 'imageUrl', 'isShow'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private carouselService: CarouselService) {
  }

  ngOnInit(): void {
    this.loadCarousel();
  }

  loadCarousel(): void {
    this.carouselService.getListCarousel().subscribe(data => {
      this.listCarousel = data;
      this.dataSource = new MatTableDataSource<CarouselItem>(this.listCarousel);
      this.dataSource.paginator = this.paginator;
    });
  }

  toggleStatus(element: any) {
    const newStatus = !element.isShow;
    console.log('element', element);
    this.carouselService.updateStatus(element.id, newStatus).subscribe({
      next: () => {
        element.isShow = newStatus;
      },
      error: () => {
        console.log('update failed!')
      }
    });
  }

}
