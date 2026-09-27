import {TableRequest} from "./TableRequest";

export class CreditContractTSBD {
  id?: number;
  // Thông tin hợp đồng thế chấp
  soHopDongTheChapQSDD?: string;
  ngayTheChap?: string;
  noiDungNgoaiBia?: string;
  serial?: string;
  noiCapSo?: string;
  ngayCapSo?: string;
  noiDungVaoSo?: string;

  // Thông tin thửa đất
  soThuaDat?: string;
  soBanDo?: string;
  diaChiThuaDat?: string;
  dienTichDatSo?: string;
  dienTichDatChu?: string;
  thoiHanSuDung?: string;
  hinhThucSuDung?: string;
  dienTichTS?: string;
  loaiNha?: string;
  ketCauXayDung?: string;
  // Nội dung khác
  muchDichSuDung?: string;
  loaiDat?: string;
  noiDungThoaThuan?: string;
  nguonGocSuDung?: string;
  ghiChu?: string;

  // Các checkbox riêng cho từng tài sản
  checkMucDich?: boolean;
  checkLoaiDat?: boolean;
  checkNguonGocSuDung?: boolean;
  checkGhiChu?: boolean;
  checkHopDongBaoLanh?: boolean;

  // Người đứng tên bìa đỏ 1
  dungTenBiaDo1?: string;
  gioiTinhDungTenBiaDo1?: string;
  namSinhDungTenBiaDo1?: string;
  cccdDungTenBiaDo1?: string;
  ngayCapCCCDDungTenBiaDo1?: string;
  noiCapCCCDDungTenBiaDo1?: string;
  diaChiThuongTruDungTenBiaDo1?: string;
  phoneDungTenBiaDo1?: string;

  // Người đứng tên bìa đỏ 2
  dungTenBiaDo2?: string;
  gioiTinhDungTenBiaDo2?: string;
  namSinhDungTenBiaDo2?: string;
  cccdDungTenBiaDo2?: string;
  ngayCapCCCDDungTenBiaDo2?: string;
  noiCapCCCDDungTenBiaDo2?: string;
  diaChiThuongTruDungTenBiaDo2?: string;

  // Các checkbox CMND/CCCD
  cmndDungTenBiaDo1?: string;
  ngayCapCCCDTruocDayDungTenBiaDo1?: string;
  checkCMNDDungTenBiaDo1?: boolean;
  checkNgayCapCCCDTruocDayDungTenBiaDo1?: boolean;
  checkDiaChiThuongTruDungTenBiaDo1?: boolean;
  checkChiMangTenNguoi1?: boolean;

  cmndDungTenBiaDo2?: string;
  ngayCapCCCDTruocDayDungTenBiaDo2?: string;
  checkCMNDDungTenBiaDo2?: boolean;
  checkNgayCapCCCDTruocDayDungTenBiaDo2?: boolean;
  checkDiaChiThuongTruDungTenBiaDo2?: boolean;
  checkChiMangTenNguoi2?: boolean;
  checkDongSoHuu?: boolean;

  // Thông tin khác
  checkNguoiMangTenBiaDo?: boolean;
  nguoiMangTen?: string;
  landItems?: string;
  tongTaiSanBD?: string;
  tongTaiSanBDChu?: string;

  checkTrongDo?: boolean;
  trongDo?: string;

  // ✅ Bổ sung các bảng riêng cho từng tài sản
  table1?: TableRequest;
  table2?: TableRequest;
  table3?: TableRequest;
}
