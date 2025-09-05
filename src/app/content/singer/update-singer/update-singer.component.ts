import {Component, Inject, OnInit} from '@angular/core';
import {Singer} from "../../../model/Singer";
import {Nation} from "../../../model/Nation";
import {ActivatedRoute} from "@angular/router";
import {SingerService} from "../../../service/singer.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-update-singer',
  templateUrl: './update-singer.component.html',
  styleUrls: ['./update-singer.component.css']
})
export class UpdateSingerComponent implements OnInit {
  status = 'Fill in the form to update';
  // @ts-ignore
  singer = new Singer();
  listNation: Nation[] = [
    {id: 1, name: 'Việt Nam'},
    {id: 2, name: 'China'},
    {id: 3, name: 'Korea'},
    {id: 4, name: 'Canada'},
    {id: 5, name: 'United States'},
    {id: 6, name: 'Thailand'},
    {id: 7, name: 'Norway'}
  ];

  constructor(private actRouter: ActivatedRoute,
              private singerService: SingerService,
              @Inject(MAT_DIALOG_DATA)
              public data: any) {
  }

  onUpload($event: string) {
    this.singer.avatar = $event
  }


  ngOnInit(): void {

    // console.log('data tu inject --->', this.data.dataKey)
    this.singerService.findSingerById(this.data.dataKey).subscribe(data => {
      this.singer = data;
      // console.log('category OLD ------------------>', this.singer)
    })
  }

  updateSinger() {
    // console.log("đã vào hàm update")
    // console.log( "singer -----------------",this.singer)

    // @ts-ignore
    this.singerService.updateSinger(this.singer?.id, this.singer).subscribe(data => {
      console.log("data")
      if (data.message == 'no_change') {
        this.status = 'No change';
      } else if (data.message == 'update_success') {
        this.status = 'Update success!!!'
      }
    })
  }
}
