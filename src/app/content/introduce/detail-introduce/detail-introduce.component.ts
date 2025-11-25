import {Component, Input, OnInit} from '@angular/core';
import {Introduce} from "../../../model/Introduce";
import {ActivatedRoute} from "@angular/router";
import {IntroduceService} from "../../../service/introduce.service";

@Component({
  selector: 'app-detail-introduce',
  templateUrl: './detail-introduce.component.html',
  styleUrls: ['./detail-introduce.component.css']
})
export class DetailIntroduceComponent implements OnInit {
  @Input() introduce!: Introduce;
constructor(private route: ActivatedRoute,
            private introduceService: IntroduceService) {

}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.introduceService.getIntroduceById(+id).subscribe(data => {
        this.introduce = data;
      });
    }
  }
}
