import {Component, Input, OnInit} from '@angular/core';
import {News} from "../../../model/News";
import {ActivatedRoute} from "@angular/router";
import {CarouselService} from "../../../service/carousel.service";
import {NewsService} from "../../../service/news.service";

@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.css']
})
export class DetailNewsComponent implements OnInit {
  @Input() news!: News;
  constructor(private route: ActivatedRoute,
              private newsService: NewsService,) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.newsService.getNewsById(+id).subscribe(data => {
        this.news = data;
      });
    }
  }
}
