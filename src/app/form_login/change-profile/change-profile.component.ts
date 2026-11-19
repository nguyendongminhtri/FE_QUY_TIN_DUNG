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
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // 1. Khởi tạo form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      // SĐT Việt Nam: bắt đầu bằng 0 hoặc +84, theo sau là 9 chữ số
      phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)\d{9}$/)]],
      address: ['', [Validators.required, Validators.maxLength(255)]]
    });

    // 2. Lấy dữ liệu trực tiếp từ SessionStorage qua TokenService
    this.profileForm.patchValue({
      name: this.tokenService.getName(),
      email: this.tokenService.getEmail(),
      phone: this.tokenService.getPhone(),
      address: this.tokenService.getAddress()
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

          // Cập nhật lại TokenService để các component khác (như Header) đồng bộ theo
          const { name, email, phone, address } = this.profileForm.value;

          this.tokenService.setName(name);
          this.tokenService.setEmail(email);
          this.tokenService.setPhone(phone);
          this.tokenService.setAddress(address);

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
