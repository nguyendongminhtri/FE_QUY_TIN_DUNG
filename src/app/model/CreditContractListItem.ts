export interface CreditContractListItem {
  id: number;
  tenKhachHang: string;
  cccdKhachHang: string;
  namSinhKhachHang: string;
  phoneKhachHang: string;
  soTheThanhVienKhachHang: string;
  loaiVay: string;
  soHopDongTD: string;
  muchDichVay: string;
  tatToan: boolean | null;
  vayLai: boolean | null;
  reLoanSequence: number | null;
  createdByUsername: string | null;
  createdAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}
