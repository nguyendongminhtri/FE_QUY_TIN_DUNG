export interface KpiDieuChinh {
  id: number;
  nhom: 'DINH_TINH' | 'CHUYEN_MON';
  diem: number;
  lyDo: string;
  nguoiNhap: string;
  createdAt: string;
}

export interface KpiKeToanRow {
  username: string;
  laKeToanTruong: boolean;
  soKhach: number;
  soLuot: number;
  tyLeKhach: number;
  tyLeLuot: number;
  diemDinhLuong: number;
  diemDinhTinh: number;
  diemChuyenMon: number | null;
  diemKeToanTruong: number | null;
  tongDiem: number;
  xepLoai: 'A' | 'B' | 'C' | 'D';
  dieuChinh: KpiDieuChinh[];
  tyLeHuyDong: number;
  soTangRongHuyDong: number;        // đồng
  dinhMucHuyDongApDung: number;     // đồng, định mức theo chi nhánh của người này
  maChiNhanh: string | null;        // '01' | '02' | 'ALL' | null
  diemVuot: number;
  diemKhach: number;
  diemLuot: number;
  diemHuyDong: number;
}

export interface KpiDinhMuc {
  dinhMucKhach: number;
  dinhMucLuot: number;
  dinhMucHuyDong01: number;   // triệu đồng
  dinhMucHuyDong02: number;   // triệu đồng
  trongSoKhach: number;
  trongSoLuot: number;
  trongSoHuyDong: number;
  keToanTruong: string;
}

export interface KpiKeToanResponse {
  dinhMuc: KpiDinhMuc;
  rows: KpiKeToanRow[];
  laAdmin: boolean;
  coQuyenChamDiem: boolean;
  huyDong: KpiHuyDongKy[];
  mucTieuNam: KpiMucTieuNam | null;
}
export interface KpiHuyDongKy {
  maChiNhanh: string;
  tenChiNhanh: string;
  duDauKy: number;
  duCuoiKy: number;
  tangRong: number;
}
export interface KpiNhanVienChiNhanh {
  username: string;
  maChiNhanh: string | null;
  tenChiNhanh: string | null;
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

