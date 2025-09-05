import {Component, OnInit} from '@angular/core';
import {SongService} from "../../service/song.service";
import {Song} from "../../model/Song";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  constructor(private songService: SongService) {
  }

  listSongRandom: Song[] = [];
  ngOnInit(): void {
    // Lấy danh sách các radio button
    var radioButtons = document.querySelectorAll('input[name="slider"]');
    var currentIndex = 0;

    // Tự động chuyển đổi hình ảnh sau một khoảng thời gian
    var interval = setInterval(function () {
      // Di chuyển đến radio button tiếp theo
      currentIndex = (currentIndex + 1) % radioButtons.length;
      // @ts-ignore
      radioButtons[currentIndex].checked = true;
    }, 2000);

    this.songService.get3SongRandom().subscribe(data => {

      console.log("3 bai ------>",data )
      this.listSongRandom = data;
    })
  }

}
