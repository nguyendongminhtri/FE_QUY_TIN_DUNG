export interface KpiChiTiet { ten: string; diem: number; toiDa: number; ghiChu?: string; }
export interface KpiManagement {
  username: string;
  hoTen: string;
  boPhan: string;
  chucVu: string;
  diemDinhLuong: number;
  diemDinhTinh: number;
  diemCongThem: number;
  diemTru: number;
  tongDiem: number;
  xepLoai: 'A' | 'B' | 'C' | 'D';
  lyDoTru?: string;
  chiTiet: KpiChiTiet[];
}
