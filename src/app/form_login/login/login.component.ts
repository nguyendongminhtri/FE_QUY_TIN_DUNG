import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {SignInForm} from "../../model/SignInForm";
import {TokenService} from "../../service/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: any = {};
  status = '';
  signIpForm?: SignInForm;


  hide = true;

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router) {
  }

  login() {
    this.signIpForm = new SignInForm(
      this.form.username,
      this.form.password
    )
    this.authService.signIn(this.signIpForm).subscribe({
      next: data => {
        console.log('data ==== ', data);
        // @ts-ignore
        if (data.status == 202) {
          this.status = 'Login failed! Please check your account!';
        } else {
          // @ts-ignore
          this.tokenService.setName(data.name);
          // @ts-ignore
          this.tokenService.setAvatar(data.avatar);
          // @ts-ignore
          this.tokenService.setToken(data.token);
          // @ts-ignore
          this.tokenService.setEmail(data.email);
          // @ts-ignore
          this.tokenService.setPhone(data.phone);
          // @ts-ignore
          this.tokenService.setAddress(data.address);
          // @ts-ignore
          this.tokenService.setRole(data.roles);
          this.router.navigate(['']).then(() => {
            window.location.reload();
          })
        }
      },
      error: err => {
        console.log('error', err)
        if (err.status === 403 && err.error?.message === 'locked') {
          this.status = 'Tài khoản của bạn đã bị khoá, vui lòng liên hệ quản trị viên';
        } else {
          this.status = 'Login failed! Please check your account!';
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.getRegister()){
      this.status = 'Register success';
    }
  }
}
