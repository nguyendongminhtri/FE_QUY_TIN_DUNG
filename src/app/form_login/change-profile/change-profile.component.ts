import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {TokenService} from "../../service/token.service";

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css']
})
export class ChangeProfileComponent {
  profileForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService // Tiêm TokenService vào
  ) {}

  ngOnInit(): void {
    // 1. Khởi tạo form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });

    // 2. Lấy dữ liệu trực tiếp từ SessionStorage qua TokenService (Cực nhanh, không cần gọi API)
    this.profileForm.patchValue({
      name: this.tokenService.getName(),
      email: this.tokenService.getEmail()
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        if (res.message === 'yes') {
          this.successMessage = 'Cập nhật thông tin thành công!';
          this.errorMessage = '';

          // Cập nhật lại giá trị mới vào TokenService để các component khác (như Header) ăn theo luôn
          const newName = this.profileForm.get('name')?.value;
          const newEmail = this.profileForm.get('email')?.value;

          this.tokenService.setName(newName);
          this.tokenService.setEmail(newEmail);

        } else if (res.message === 'no_email') {
          this.errorMessage = 'Email này đã được sử dụng bởi tài khoản khác!';
          this.successMessage = '';
        }
      },
      error: (err) => {
        this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại sau.';
        this.successMessage = '';
      }
    });
  }
}
