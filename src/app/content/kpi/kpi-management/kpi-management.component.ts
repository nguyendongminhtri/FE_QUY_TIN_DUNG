import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {KpiManagement} from '../../../model/KpiManagement';
import {KpiManagementService} from '../../../service/kpi-management.service';

@Component({
  selector: 'app-kpi-management',
  templateUrl: './kpi-management.component.html',
  styleUrls: ['./kpi-management.component.css']
})
export class KpiManagementComponent implements OnInit {
  ky = this.thangHienTai();

  // các nút chuyển sang màn tính điểm của từng bộ phận
  dsBoPhan = [
    {ma: 'KE_TOAN', ten: 'Kế toán'},
    {ma: 'TIN_DUNG', ten: 'Tín dụng'},
    {ma: 'KIEM_SOAT', ten: 'Kiểm soát'},
  ];

  cot = ['stt', 'hoTen', 'boPhan', 'chucVu', 'dinhLuong', 'dinhTinh', 'congTru', 'tongDiem', 'xepLoai'];
  dataSource = new MatTableDataSource<KpiManagement>([]);
  dangMo: KpiManagement | null = null;   // dòng đang xổ chi tiết
  coQuyenTruDiem = false;                // lấy từ role của user đăng nhập

  // path của từng màn tính điểm, khớp với file routing
  private readonly routeBoPhan: Record<string, string> = {
    KE_TOAN: '/kpi-ketoan',
    TIN_DUNG: '/kpi-tindung',
    KIEM_SOAT: '/kpi-kiemsoat',
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private svc: KpiManagementService, private router: Router) {}

  ngOnInit(): void {
    this.taiDuLieu();
  }

  taiDuLieu(): void {
    this.svc.getTongHop(this.ky).subscribe(ds => {
      this.dataSource.data = ds;
      this.dataSource.sort = this.sort;
    });
  }

  moChiTiet(row: KpiManagement): void {
    this.dangMo = this.dangMo === row ? null : row;
  }

  // bấm nút bộ phận: chuyển sang component con
  diDenBoPhan(ma: string): void {
    const path = this.routeBoPhan[ma];
    if (!path) {
      return;
    }
    this.router.navigate([path], {queryParams: {ky: this.ky}});
  }

  // bấm "Xem màn tính điểm" của một người: chuyển sang component con kèm user
  diDenManTinh(row: KpiManagement): void {
    const path = this.routeBoPhan[row.boPhan];
    if (!path) {
      return;
    }
    this.router.navigate([path], {queryParams: {ky: this.ky, user: row.username}});
  }

  private thangHienTai(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
}
