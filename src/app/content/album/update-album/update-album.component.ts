import {Component, Inject} from '@angular/core';
import {Category} from "../../../model/Category";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../../service/category.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Album} from "../../../model/Album";
import {AlbumService} from "../../../service/album.service";

@Component({
  selector: 'app-update-album',
  templateUrl: './update-album.component.html',
  styleUrls: ['./update-album.component.css']
})
export class UpdateAlbumComponent {
  status = '';
  // @ts-ignore
  album = new Album();

  constructor(private actRouter: ActivatedRoute,
              private albumService: AlbumService,
              @Inject(MAT_DIALOG_DATA)
              public data: any) {
  }
  updateAlbum() {
    // @ts-ignore
    this.albumService.updateAlbum(this.album?.id, this.album).subscribe(data =>{
      console.log('data UPDATE ========================>', data)
      if(data.message=='no_change'){
        this.status = 'No change';
      } else if(data.message == 'name_existed'){
        this.status ='Name existed!'
      } else if(data.message == 'update_success'){
        this.status = 'Update success!!!'
      }
    })
  }

  onUpload($event: string) {
    this.album.avatar = $event
  }

  ngOnInit(): void {
    console.log('data tu inject --->', this.data.dataKey)
    this.albumService.getAlbumById(this.data.dataKey).subscribe(data =>{
      this.album = data;
      console.log('category OLD -------------------- --->', this.album)
    })
    // this.actRouter.paramMap.subscribe(categoryId => {
    //   console.log('categoryId ---->', categoryId)
    //   // @ts-ignore
    //   const id = +categoryId.get('id');
    //   console.log('id ---->', id)
    //   this.categoryService.getCategoryById(id).subscribe(data => {
    //     this.category = data;
    //     console.log('category --->', this.category)
    //   })
    // })
  }
}
