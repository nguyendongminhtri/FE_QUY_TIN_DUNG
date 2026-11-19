export interface KpiDinhMuc {
  id?: number;
  ky?: string;
  dinhMucKhach: number;
  dinhMucLuot: number;
  dinhMucHuyDong01: number;
  dinhMucHuyDong02: number;
  trongSoKhach: number;
  trongSoLuot: number;
  trongSoHuyDong: number;
  keToanTruong: string;
}

export interface KpiDieuChinh {
  id: number;
  ky?: string;
  username?: string;
  nhom: 'DINH_TINH' | 'CHUYEN_MON' | 'KE_TOAN_TRUONG';
  diem: number;
  lyDo: string;
  nguoiNhap: string;
  createdAt: string;
}

export interface KpiKeToanRow {
  username: string;
  laKeToanTruong: boolean;
  maChiNhanh: string | null;      // '01' | '02' | null (chưa phân)
  tenChiNhanh: string;
  soKhach: number;
  tyLeKhach: number;
  diemKhach: number;
  soLuot: number;
  tyLeLuot: number;
  diemLuot: number;
  soTangRongHuyDong: number;
  dinhMucHuyDongApDung: number;
  tyLeHuyDong: number;
  diemHuyDong: number;
  diemDinhLuong: number;
  diemVuot: number;
  diemDinhTinh: number;
  diemChuyenMon: number | null;
  diemKeToanTruong: number | null;
  tongDiem: number;
  xepLoai: string;
  dieuChinh: KpiDieuChinh[];
}

export interface KpiHuyDongKy {
  maChiNhanh: string;             // '01' | '02' | 'ALL'
  tenChiNhanh: string;
  duDauKy: number;
  duCuoiKy: number;
  tangRong: number;
}

export interface KpiChiNhanhTongHop {
  maChiNhanh: string;             // '01' | '02'
  tenChiNhanh: string;
  soNhanVien: number;
  nhanVien: string[];
  tongKhach: number;
  dinhMucKhach: number;
  tyLeKhach: number;
  diemKhach: number;
  tongLuot: number;
  dinhMucLuot: number;
  tyLeLuot: number;
  diemLuot: number;
  tangRong: number;
  dinhMucHuyDong: number;
  tyLeHuyDong: number;
  diemHuyDong: number;
  diemDinhLuong: number;
  diemVuot: number;
  diemDinhTinh: number;
  diemChuyenMon: number;
  coKeToanTruong: boolean;
  diemKeToanTruong: number | null;
  tongDiem: number;
  xepLoai: string;
}

export interface KpiMucTieuNam {
  nam: number;
  mucTieuHuyDong: number;
  duCuoiKy: number;
  conThieu: number;
  tyLeDat: number;
  soThangConLai: number;
  canTangMoiThang: number;
  nguoiCapNhat: string | null;
}

export interface KpiNhanVienChiNhanh {
  username: string;
  maChiNhanh: string | null;
  tenChiNhanh: string | null;
}

export interface KpiKeToanResponse {
  ky: string;
  dinhMuc: KpiDinhMuc;
  rows: KpiKeToanRow[];
  huyDong: KpiHuyDongKy[];
  chiNhanh: KpiChiNhanhTongHop[];
  mucTieuNam: KpiMucTieuNam | null;
}
