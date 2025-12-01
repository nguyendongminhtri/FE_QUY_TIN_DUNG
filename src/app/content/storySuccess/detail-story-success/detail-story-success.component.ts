import {Component, Input, OnInit} from '@angular/core';
import {News} from "../../../model/News";
import {ActivatedRoute} from "@angular/router";
import {NewsService} from "../../../service/news.service";
import {StorySuccess} from "../../../model/StorySuccess";
import {StorySuccessService} from "../../../service/story-success.service";

@Component({
  selector: 'app-detail-story-success',
  templateUrl: './detail-story-success.component.html',
  styleUrls: ['./detail-story-success.component.css']
})
export class DetailStorySuccessComponent implements OnInit {
  @Input() storySuccess!: StorySuccess;
  constructor(private route: ActivatedRoute,
              private storySuccessService: StorySuccessService,) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.storySuccessService.getStorySuccessById(+id).subscribe(data => {
        this.storySuccess = data;
      });
    }
  }
}
