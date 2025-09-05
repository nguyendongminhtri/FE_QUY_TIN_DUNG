import {Component, OnInit, ViewChild} from '@angular/core';
import {SingerService} from "../../../service/singer.service";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {Singer} from "../../../model/Singer";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detail-singer',
  templateUrl: './detail-singer.component.html',
  styleUrls: ['./detail-singer.component.css']
})
export class DetailSingerComponent implements OnInit{
  singer?: Singer;

  constructor(private act: ActivatedRoute,
              public dialog: MatDialog,
              private singerService:SingerService,
              ) {
  }
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  ngOnInit(): void {
    // if (this.tokenService.getToken()) {
    //   console.log('role ---->', this.tokenService.getRole())
    //   if (JSON.stringify(this.tokenService.getRole()) == JSON.stringify(['ADMIN'])) {
    //     this.checkUserAdmin = true;
    //   }
    //   //  console.log('role -->', this.tokenService.getRole())
    //   // if(JSON.stringify(this.tokenService.getRole())==JSON.stringify(['ADMIN'])){
    //   //   this.checkUserAdmin = true;
    //   // }
    //   // this.checkUserLogin = true;
    // }
    this.act.paramMap.subscribe(singerId =>{
      // @ts-ignore
      const id = +singerId.get('id');
      console.log("id singer" , singerId)
      this.singerService.findSingerById(id).subscribe(data =>{
        this.singer = data;
        console.log('this.singer', this.singer)
      })
    })
  }


}
