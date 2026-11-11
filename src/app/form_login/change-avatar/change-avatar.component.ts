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
  avatar = '';
  selectedFile: File | null = null;
  errorMessage = '';
  successMessage = '';
  loading = false;

  private readonly maxSize = 2 * 1024 * 1024;
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  constructor(private authService: AuthService,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.avatar = this.authService.getAvatarUrl(this.tokenService.getAvatar());
  }

  onFileSelected(event: Event): void {
    this.errorMessage = '';
    this.successMessage = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = 'Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF';
      input.value = ''; // cho phép chọn lại đúng file đó sau khi lỗi
      return;
    }
    if (file.size > this.maxSize) {
      this.errorMessage = 'Ảnh tối đa 2MB';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.revokePreview();
    this.avatar = URL.createObjectURL(file); // xem trước cục bộ
  }

  updateAvatar(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Vui lòng chọn ảnh trước';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.editAvatar(this.selectedFile).subscribe({
      next: res => {
        this.loading = false;
        this.successMessage = 'Cập nhật ảnh đại diện thành công';
        this.revokePreview();
        this.avatar = this.authService.getAvatarUrl(res.avatar);
        this.selectedFile = null;
        this.tokenService.setAvatar(res.avatar); // để header đổi ảnh theo
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Upload thất bại';
      }
    });
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  private revokePreview(): void {
    if (this.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(this.avatar);
    }
  }
}
