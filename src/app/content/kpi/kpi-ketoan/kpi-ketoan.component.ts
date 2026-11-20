import {Component} from '@angular/core';
import {KpiDinhMuc, KpiKeToanResponse, KpiKeToanRow, KpiNhanVienChiNhanh} from "../../../model/KpiKeToanResponse";
import {ActivatedRoute} from "@angular/router";
import {KpiKetoanService} from "../../../service/kpi-ketoan.service";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-kpi-ketoan',
  templateUrl: './kpi-ketoan.component.html',
  styleUrls: ['./kpi-ketoan.component.css']
})
export class KpiKetoanComponent {
  ky = this.thangHienTai();
  data: KpiKeToanResponse | null = null;
  usernameChon: string | null = null;

  // phân quyền: kiểm tra giống navbar
  isAdmin = false;                 // sửa định mức, mục tiêu, phân chi nhánh
  coQuyenChamDiem = false;         // cộng/trừ điểm, nhập lý do

  dinhMucForm: KpiDinhMuc = {
    dinhMucKhach: 250, dinhMucLuot: 350, dinhMucHuyDong01: 0, dinhMucHuyDong02: 0,
    trongSoKhach: 15, trongSoLuot: 20, trongSoHuyDong: 15,
    keToanTruong: ''
  };
  form = {nhom: 'DINH_TINH', diem: 2, lyDo: ''};

  // Mục tiêu huy động năm
  mucTieuForm = {nam: new Date().getFullYear() + 1, mucTieuHuyDong: 0};

  // Phân chi nhánh cho kế toán
  nhanVien: KpiNhanVienChiNhanh[] = [];
  moPhanChiNhanh = false;
  dsChiNhanh = [
    {ma: '01', ten: 'Trụ sở chính'},
    {ma: '02', ten: 'Phòng giao dịch'}
  ];

  constructor(private route: ActivatedRoute,
              private svc: KpiKetoanService,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    const roles: any[] = this.tokenService.getRole() || [];
    const tenRoles: string[] = roles.map(r => (r?.authority ?? r).replace(/^ROLE_/, ''));

    // Chỉ ADMIN và GD được sửa/lưu mục tiêu năm, định mức tháng, phân chi nhánh
    this.isAdmin = tenRoles.some(r => ['ADMIN', 'GD'].includes(r));

    // ADMIN, GD, KST, PGDTT, PM được cộng/trừ điểm
    this.coQuyenChamDiem = tenRoles.some(r => ['ADMIN', 'GD', 'KST', 'PGDTT', 'PM'].includes(r));

    this.route.queryParamMap.subscribe(p => {
      const ky = p.get('ky');
      if (ky) {
        this.ky = ky;
      }
      this.usernameChon = p.get('user');
      this.tai();
    });
  }

  get dangChon(): KpiKeToanRow | null {
    return this.data?.rows?.find(r => r.username === this.usernameChon) ?? null;
  }

  get soChuaPhan(): number {
    return this.nhanVien.filter(nv => !nv.maChiNhanh).length;
  }

  tai(): void {
    this.taiNhanVien();
    this.svc.getKeToan(this.ky).subscribe(res => {
      this.data = res;
      // Gán dữ liệu định mức vừa lấy được vào dinhMucForm để các ô input hiển thị đúng
      if (res && res.dinhMuc) {
        const dm = res.dinhMuc;
        this.dinhMucForm = {
          dinhMucKhach: dm.dinhMucKhach ?? 250,
          dinhMucLuot: dm.dinhMucLuot ?? 350,
          dinhMucHuyDong01: dm.dinhMucHuyDong01 ?? 0,
          dinhMucHuyDong02: dm.dinhMucHuyDong02 ?? 0,
          trongSoKhach: dm.trongSoKhach ?? 15,
          trongSoLuot: dm.trongSoLuot ?? 20,
          trongSoHuyDong: dm.trongSoHuyDong ?? 15,
          keToanTruong: dm.keToanTruong ?? ''
        };
      }
      // Gán mục tiêu năm vào form (nếu đã có)
      if (res && res.mucTieuNam) {
        this.mucTieuForm = {
          nam: res.mucTieuNam.nam,
          mucTieuHuyDong: res.mucTieuNam.mucTieuHuyDong
        };
      }
    });
  }

  taiNhanVien(): void {
    this.svc.getDanhSachKeToan(this.ky).subscribe(ds => this.nhanVien = ds);
  }

  doiChiNhanh(nv: KpiNhanVienChiNhanh, ma: string): void {
    this.svc.luuChiNhanh(nv.username, ma).subscribe({
      next: () => this.tai(),   // tải lại để điểm tính theo chi nhánh mới
      error: e => {
        alert(e.error?.message || 'Không lưu được chi nhánh');
        this.taiNhanVien();     // trả ô chọn về giá trị cũ
      }
    });
  }

  chon(row: KpiKeToanRow): void {
    this.usernameChon = this.usernameChon === row.username ? null : row.username;
    this.form = {nhom: 'DINH_TINH', diem: 2, lyDo: ''};
  }

  luuDinhMuc(): void {
    const f = this.dinhMucForm;
    const tong = Number(f.trongSoKhach) + Number(f.trongSoLuot) + Number(f.trongSoHuyDong);
    if (Math.abs(tong - 50) > 0.001) {
      alert(`Tổng điểm định lượng phải bằng 50 (hiện là ${tong})`);
      return;
    }

    // Đính kèm kỳ (ky) hiện tại vào object gửi đi để backend không bị lỗi null
    const payload = {
      ...f,
      ky: this.ky
    };

    this.svc.luuDinhMuc(payload).subscribe({
      next: () => {
        alert('Lưu định mức thành công!');
        this.tai();
      },
      error: e => alert(e.error?.message || 'Không lưu được định mức')
    });
  }

  luuMucTieu(): void {
    const f = this.mucTieuForm;
    if (!f.nam || !(Number(f.mucTieuHuyDong) > 0)) {
      alert('Vui lòng nhập năm và mục tiêu lớn hơn 0');
      return;
    }
    this.svc.luuMucTieuNam({nam: Number(f.nam), mucTieuHuyDong: Number(f.mucTieuHuyDong)}).subscribe({
      next: () => {
        alert('Lưu mục tiêu thành công!');
        this.tai();
      },
      error: e => alert(e.error?.message || 'Không lưu được mục tiêu')
    });
  }

  chamDiem(dau: 1 | -1): void {
    const dc = this.dangChon;
    if (!dc) {
      return;
    }
    this.svc.themDieuChinh({
      ky: this.ky,
      username: dc.username,
      nhom: this.form.nhom,
      diem: dau * Math.abs(this.form.diem),
      lyDo: this.form.lyDo
    }).subscribe({
      next: () => {
        this.form.lyDo = '';
        this.tai();
      },
      error: e => alert(e.error?.message || 'Không thực hiện được')
    });
  }

  xoaDieuChinh(id: number): void {
    if (!confirm('Xóa lần cộng/trừ điểm này?')) {
      return;
    }
    this.svc.xoaDieuChinh(id).subscribe(() => this.tai());
  }

  private thangHienTai(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
}
