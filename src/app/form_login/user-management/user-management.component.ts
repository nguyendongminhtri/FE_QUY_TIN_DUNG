import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {UserManage} from "../../model/UserManage";
import {UserManageService} from "../../service/user-manage.service";


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  displayedColumns = ['index', 'name', 'username', 'email', 'roles', 'locked'];
  dataSource = new MatTableDataSource<UserManage>([]);
  loading = false;
  allRoles: string[] = [];
  constructor(
    private userService: UserManageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: roles => this.allRoles = roles,
      error: () => this.notify('Không tải được danh sách quyền')
    });
  }
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: users => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('Không tải được danh sách user');
      }
    });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  onToggleLock(user: UserManage, event: MatSlideToggleChange): void {
    const locked = event.checked;
    const action = locked ? 'khoá' : 'mở khoá';
    if (!confirm(`Bạn có chắc muốn ${action} user "${user.username}"?`)) {
      event.source.checked = user.locked; // hoàn tác giao diện
      return;
    }
    this.userService.setLock(user.id, locked).subscribe({
      next: res => {
        if (res.message === 'yes') {
          user.locked = locked;
          this.notify(locked ? 'Đã khoá user' : 'Đã mở khoá user');
        } else {
          event.source.checked = user.locked;
          this.notify(this.messageText(res.message));
        }
      },
      error: () => {
        event.source.checked = user.locked;
        this.notify('Có lỗi xảy ra, vui lòng thử lại');
      }
    });
  }

  onRolesChange(user: UserManage, newRoles: string[]): void {
    const oldRoles = [...user.roles];
    user.roles = newRoles;
    this.userService.updateRoles(user.id, newRoles).subscribe({
      next: res => {
        if (res.message === 'yes') {
          this.notify('Đã cập nhật phân quyền');
        } else {
          user.roles = oldRoles;
          this.notify(this.messageText(res.message));
        }
      },
      error: () => {
        user.roles = oldRoles;
        this.notify('Có lỗi xảy ra, vui lòng thử lại');
      }
    });
  }

  private messageText(code: string): string {
    switch (code) {
      case 'self_action': return 'Bạn không thể khoá hoặc bỏ quyền ADMIN của chính mình';
      case 'no_user': return 'Không tìm thấy user';
      case 'invalid_role': return 'Quyền không hợp lệ';
      default: return 'Thao tác thất bại';
    }
  }

  private notify(msg: string): void {
    this.snackBar.open(msg, 'Đóng', { duration: 3000 });
  }
}
