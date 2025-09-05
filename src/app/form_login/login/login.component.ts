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
    this.authService.signIn(this.signIpForm).subscribe(data => {
      // console.log("user account -------> ", data);
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
        this.tokenService.setRole(data.roles);
        this.router.navigate(['']).then(() => {
          window.location.reload();
        })
      }
    })
  }

  ngOnInit(): void {
    if (this.authService.getRegister()){
      this.status = 'Register success';
    }
  }
}
