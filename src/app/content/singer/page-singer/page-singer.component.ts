import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Singer} from "../../../model/Singer";
import {SingerService} from "../../../service/singer.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateSingerComponent} from "../create-singer/create-singer.component";
import {MatTableDataSource} from "@angular/material/table";
import {TokenService} from "../../../service/token.service";
import {ActivatedRoute} from "@angular/router";
import {UpdateSingerComponent} from "../update-singer/update-singer.component";
import {DeleteCategoryComponent} from "../../category/delete-category/delete-category.component";
import {Category} from "../../../model/Category";
import {DeleteSingerComponent} from "../delete-singer/delete-singer.component";

@Component({
  selector: 'app-page-singer',
  templateUrl: './page-singer.component.html',
  styleUrls: ['./page-singer.component.css']
})
export class PageSingerComponent implements OnInit{
  singerList?: Singer[];
  totalElements: number=0;
  singer?: Singer;
  checkUserAdmin= false;
  dataSource: any;
  constructor(private singerService: SingerService,
              public dialog:MatDialog,
              private tokenService: TokenService,
              private act:ActivatedRoute,) {
  }

  getPageRequest(request:any){
    this.singerService.getPageSinger(request).subscribe(data =>{
      this.singerList = data['content'];
      this.totalElements = data['totalElements']
    })
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  openDialogCreate() {
    const dialogRef = this.dialog.open(CreateSingerComponent)
    dialogRef.afterClosed().subscribe(result =>{
      if (result||result == undefined){
        // this.singerService.getPageSinger({page:0,size:5});
        this.getPageRequest({page:0,size:5})
      }
    })
  }


  nextPage($event: PageEvent) {
    const request={};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    this.getPageRequest(request);
  }

  ngOnInit(): void {
    const request = {page:0,size:5}
    this.getPageRequest(request);

    if (this.tokenService.getToken()) {
      // console.log('role ---->', this.tokenService.getRole())
      if (JSON.stringify(this.tokenService.getRole()) == JSON.stringify(['ADMIN'])) {
        this.checkUserAdmin = true;
      }
    }
    this.act.paramMap.subscribe(singerId =>{
      // @ts-ignore
      const id = +singerId.get('id');
      // console.log("id singer" , singerId)
      this.singerService.findSingerById(id).subscribe(data =>{
        this.singer = data;
        // console.log('this.singer', this.singer)
      })
    })
  }

  openDialogDelete(id: any) {
    const dialogRef = this.dialog.open(DeleteSingerComponent)
    {
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      this.singerService.deleteSinger(id).subscribe(() => {
      })
      this.getPageRequest({page:0,size:5})
    })
  }
  openDialogUpdate(id: any) {
    const dialogRef = this.dialog.open(UpdateSingerComponent, {
      data: {
        dataKey: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result || result == undefined) {
        this.getPageRequest({page:0,size:5})
      }
    });
  }
}
