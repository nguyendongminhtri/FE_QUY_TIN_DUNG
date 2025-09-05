import {Component, OnInit, ViewChild} from '@angular/core';
import {SongService} from "../../service/song.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Song} from "../../model/Song";
import {Category} from "../../model/Category";
import {Album} from "../../model/Album";
import {Singer} from "../../model/Singer";

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css']
})
export class PageSearchComponent {
  search?: string;
  listSong?: Song[];
  listCategory?: Category[];
  listAlbum?: Album[];
  listSinger?: Singer[];
  totalElementsSong: number = 0;
  totalElementsCategory: number = 0;
  totalElementsAlbum: number = 0;
  totalElementsSinger: number = 0;

  constructor(private songService: SongService) {
    this.songService.getValue().subscribe(data => {
      this.search = data
      console.log("search page ", this.search)
      if (this.search == '') {
        this.listSong = [];
        this.listCategory = [];
        this.listAlbum = [];
        this.listSinger = [];
        return;
      }
      const requestSong = {page: 0, size: 6}
      this.getPageRequestSong(requestSong, this.search);
      const requestCategory = {page: 0, size: 6}
      this.getPageRequestCategory(requestCategory, this.search);
      const requestAlbum = {page: 0, size: 6}
      this.getPageRequestAlbum(requestAlbum, this.search);
      const requestSinger = {page: 0, size: 6}
      this.getPageRequestSinger(requestSinger, this.search);
    })

  }


  @ViewChild(MatPaginator) paginator?: MatPaginator;

  getPageRequestSong(request: any, search: string) {
    this.songService.getPageSearchSong(request, search).subscribe(data => {
      console.log("song---->", data)
      this.listSong = data.songPage['content'];
      console.log("song list", this.listSong)
      this.totalElementsSong = data.songPage['totalElements']
    })
  }

  getPageRequestCategory(request: any, search: string) {
    this.songService.getPageSearchSong(request, search).subscribe(data => {
      console.log("song---->", data)
      this.listCategory = data.categoryPage['content'];
      console.log("song list", this.listSong)
      this.totalElementsCategory = data.categoryPage['totalElements']
    })
  }

  getPageRequestAlbum(request: any, search: string) {
    this.songService.getPageSearchSong(request, search).subscribe(data => {
      console.log("song---->", data)
      this.listAlbum = data.albumPage['content'];
      console.log("song list", this.listSong)
      this.totalElementsAlbum = data.albumPage['totalElements']
    })
  }

  getPageRequestSinger(request: any, search: string) {
    this.songService.getPageSearchSong(request, search).subscribe(data => {
      this.listSinger = data.singerPage['content'];
      this.totalElementsSinger = data.singerPage['totalElements']
    })
  }

  nextPageSong($event: PageEvent) {
    const request = {};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    // @ts-ignore
    this.getPageRequestSong(request, this.search);
  }

  nextPageCategory($event: PageEvent) {
    const request = {};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    // @ts-ignore
    this.getPageRequestCategory(request, this.search);
  }

  nextPageAlbum($event: PageEvent) {
    const request = {};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    // @ts-ignore
    this.getPageRequestAlbum(request, this.search);
  }

  nextPageSinger($event: PageEvent) {
    const request = {};
    // @ts-ignore
    request['page'] = $event.pageIndex.toString();
    // @ts-ignore
    request['size'] = $event.pageSize.toString();
    // @ts-ignore
    this.getPageRequestSinger(request, this.search);
  }


}
