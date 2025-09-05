import {Component} from '@angular/core';
import {SignUpForm} from "../../model/SignUpForm";
import {FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: any = {};
  status = '';
  signUpForm?: SignUpForm;

  emailFormValidate = new FormControl('', [
    Validators.required,
    // Validators.pattern('[a-zA-Z0-9._%+-]+@gmail\\.com$')
    Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  ])

  hide = true;

  constructor(private authService: AuthService,
              private router: Router) {
  }


  register() {
    this.signUpForm = new SignUpForm(
      this.form.name,
      this.form.username,
      this.form.email,
      this.form.password
    )
    // console.log("this signUpForm ---->", this.signUpForm);
    this.authService.signUp(this.signUpForm).subscribe(data => {
      // console.log('data ---->', data);
      if (data.message == 'no_user') {
        this.status = 'The username is existed! Please try again!'
      } else if (data.message == 'no_email') {
        this.status = 'The email is existed! Please try again!'
      } else if (data.message == 'yes') {
        // this.status = "Create account success!"
        this.authService.setRegister(true);
        this.router.navigate(['login']);
      }
    })
  }
}
