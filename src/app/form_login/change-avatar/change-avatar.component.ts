import { Component } from '@angular/core';
import {ChangeAvatar} from "../../model/ChangeAvatar";
import {AuthService} from "../../service/auth.service";
import {TokenService} from "../../service/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {
  form: any = {}
  changeAvatar?: ChangeAvatar;
  status = ''
  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router:Router) {
  }
  updateAvatar() {
    this.changeAvatar = new ChangeAvatar(
      this.form.avatar
    )
    this.authService.editAvatar(this.changeAvatar).subscribe(data =>{
      console.log('data -->',data)
      if(data.message == 'no'){
        this.status = 'Update Failed! Please choose upload file!'
      } else {
        this.tokenService.setAvatar(this.form.avatar);
        this.router.navigate(['']).then(()=>{
          window.location.reload();
        })

      }
    })
  }

  onUpload($event: string) {
    this.form.avatar = $event;
  }
}
