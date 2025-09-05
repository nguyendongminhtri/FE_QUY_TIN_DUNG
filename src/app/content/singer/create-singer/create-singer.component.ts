import {Component} from '@angular/core';
import {Singer} from "../../../model/Singer";
import {SingerService} from "../../../service/singer.service";
import {Nation} from "../../../model/Nation";


@Component({
  selector: 'app-create-singer',
  templateUrl: './create-singer.component.html',
  styleUrls: ['./create-singer.component.css']
})
export class CreateSingerComponent {
  form: any = {};
  singer?: Singer;
  status = '';


  listNation: Nation[] = [
    {id: 1, name: 'Việt Nam'},
    {id: 2, name: 'China'},
    {id: 3, name: 'Korea'},
    {id: 4, name: 'Canada'},
    {id: 5, name: 'United States'},
    {id: 6, name: 'Thailand'},
    {id: 7, name: 'Norway'}
  ];

  constructor(private singerService: SingerService) {
  }

  createSinger() {
    if (this.form.avatar == undefined) {
      this.status = 'Please choose an avatar';
      return
    }
    if (this.form.sex == undefined) {
      this.status = 'Please choose gender!';
      return;
    }
    if (this.form.nation == undefined) {
      this.status = 'Please choose nation!';
      return;
    }
    if (this.form.birthday == undefined) {
      this.status = 'Please choose date!';
      return;
    }
    console.log('nation --->', this.form.nation)
    this.singer = new Singer(
      this.form.name,
      this.form.sex,
      this.form.nation.name,
      this.form.birthday,
      this.form.description,
      this.form.avatar,
    )
    console.log("singer ------->", this.singer)
    this.singerService.createSingerService(this.singer).subscribe(data => {
      console.log("data ------->" ,data);

      if (data.message == 'create_success') {
        console.log("singer ->" ,data)
        this.status = 'Create singer success';
      }
    })
  }

  onUpload($event: any) {
    this.form.avatar = $event;
  }

}
