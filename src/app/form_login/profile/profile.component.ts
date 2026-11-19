import { Component } from '@angular/core';
import {TokenService} from "../../service/token.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  name = '';
  email = '';
  phone = '';
  address = '';
  avatar = '';
  roleLabel = '';

  constructor(private authService: AuthService,
              private tokenService: TokenService) {}

  ngOnInit(): void {
    this.name = this.tokenService.getName();
    this.email = this.tokenService.getEmail();
    this.phone = this.tokenService.getPhone();
    this.address = this.tokenService.getAddress();
    this.avatar = this.authService.getAvatarUrl(this.tokenService.getAvatar());

    // Nếu TokenService có hàm lấy role thì hiển thị, ví dụ ROLE_ADMIN -> ADMIN
    const roles: any = (this.tokenService as any).getRole?.();
    const first = Array.isArray(roles) ? roles[0] : roles;
    this.roleLabel = first ? String(first.authority ?? first).replace('ROLE_', '') : '';
  }
}
