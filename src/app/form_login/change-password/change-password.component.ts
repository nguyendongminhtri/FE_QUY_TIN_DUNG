import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  form: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatch }
    );
  }

  private passwordMatch(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.form.value;
    this.loading = true;
    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Đổi mật khẩu thành công', 'Đóng', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Đổi mật khẩu thất bại, vui lòng kiểm tra lại mật khẩu cũ', 'Đóng', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
