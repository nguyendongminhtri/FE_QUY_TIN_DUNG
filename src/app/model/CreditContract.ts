import {FileMetadataEntity} from "./FileMetadataEntity";
import {TableRequest} from "./TableRequest";

export class CreditContract {
  id?: number;
  contractDate: string;
  nguoiDaiDien?: string;
  tenKhachHang?: string;
  gtkh?: string;
  namSinhKhachHang?: string;
  phoneKhachHang?: string;
  soTheThanhVienKhachHang?: string;
  cccdKhachHang?: string;
  ngayCapCCCDKhachHang?: string;
  diaChiThuongTruKhachHang?: string;
  //Người thân
  gtnt?: string;
  tenNguoiThan?: string;
  namSinhNguoiThan?: string;
  cccdNguoiThan?: string;
  ngayCapCCCDNguoiThan?: string;
  diaChiThuongTruNguoiThan?: string;
  quanHe?: string;
  tienSo?: string;
  tienChu?: string;
  muchDichVay?: string;
  hanMuc?: string;
  laiSuat?: string;
  soHopDongTheChapQSDD?: string;

  serial?: string;
  noiCapSo?: string;
  ngayCapSo?: string;
  noiDungVaoSo?: string;
  soThuaDat?: string;
  soBanDo?: string;
  diaChiThuaDat?: string;
  dienTichDatSo?: string;
  dienTichDatChu?: string;
  hinhThucSuDung?: string;
  muchDichSuDung?: string;
  thoiHanSuDung?: string;
  soBienBanDinhGia?: string;
  noiDungThoaThuan?: string;
  nguonGocSuDung?: string;
  ghiChu?: string;
  choVay?: string;
  loaiVay?: string;
  fileAvatarUrls?: FileMetadataEntity[] = [];
  avatars?: FileMetadataEntity[] = [];
  tableJson?: string
  checkOption?: boolean;
  constructor(contractDate: string, nguoiDaiDien?: string, tenKhachHang?: string,
              namSinhKhachHang?: string, sdtKhachHang?: string, sttvKhachHang?: string,
              cccdKhachHang?: string, ngayCapCCCDKhachHang?: string,
              diaChiThuongChuKhachHang?: string, tenNguoiThan?: string,
              namSinhNguoiThan?: string, cccdNguoiThan?: string,
              ngayCapCCCDNguoiThan?: string, diaChiThuongTruNguoiThan?: string,
              quanHe?: string, tienSo?: string, tienChu?: string, hanMuc?: string,
              laiSuat?: string, soHopDongTheChapQSDD?: string, muchDichVay?: string,
              serial?: string, noiCapSo?: string, ngayCapSo?: string, noiDungVoSo?: string,
              soThuaDat?: string, soBanDo?: string, diaChiThuaDat?: string, dienTichDatSo?: string,
              dienTichDatChu?: string, hinhThucSuDung?: string, muchDichSuDung?: string,
              thoiHanSuDung?: string, soBienBanDinhGia?: string, noiDungThoaThuan?: string,
              gtkh?: string, gtnt?: string, nguonGocSuDung?: string, ghiChu?: string, fileAvatarUrls?: FileMetadataEntity[],
              choVay?: string, loaiVay?: string, checkOption?: boolean) {
    this.contractDate = contractDate;
    this.nguoiDaiDien = nguoiDaiDien;
    this.tenKhachHang = tenKhachHang;
    this.namSinhKhachHang = namSinhKhachHang;
    this.phoneKhachHang = sdtKhachHang;
    this.soTheThanhVienKhachHang = sttvKhachHang;
    this.cccdKhachHang = cccdKhachHang;
    this.ngayCapCCCDKhachHang = ngayCapCCCDKhachHang;
    this.diaChiThuongTruKhachHang = diaChiThuongChuKhachHang;
    this.tenNguoiThan = tenNguoiThan;
    this.namSinhNguoiThan = namSinhNguoiThan;
    this.cccdNguoiThan = cccdNguoiThan;
    this.ngayCapCCCDNguoiThan = ngayCapCCCDNguoiThan;
    this.diaChiThuongTruNguoiThan = diaChiThuongTruNguoiThan;
    this.quanHe = quanHe;
    this.tienSo = tienSo;
    this.tienChu = tienChu;
    this.laiSuat = laiSuat;
    this.hanMuc = hanMuc;
    this.soHopDongTheChapQSDD = soHopDongTheChapQSDD
    this.muchDichVay = muchDichVay;
    this.serial = serial;
    this.noiCapSo = noiCapSo;
    this.ngayCapSo = ngayCapSo;
    this.noiDungVaoSo = noiDungVoSo;
    this.soThuaDat = soThuaDat;
    this.soBanDo = soBanDo;
    this.diaChiThuaDat = diaChiThuaDat;
    this.dienTichDatSo = dienTichDatSo;
    this.dienTichDatChu = dienTichDatChu;
    this.hinhThucSuDung = hinhThucSuDung;
    this.thoiHanSuDung = thoiHanSuDung;
    this.muchDichSuDung = muchDichSuDung;
    this.soBienBanDinhGia = soBienBanDinhGia
    this.noiDungThoaThuan = noiDungThoaThuan;
    this.gtnt = gtnt;
    this.gtkh = gtkh;
    this.nguonGocSuDung = nguonGocSuDung;
    this.ghiChu = ghiChu;
    this.fileAvatarUrls = fileAvatarUrls;
    this.choVay =choVay;
    this.loaiVay = loaiVay;
    this.checkOption = checkOption;
  }
}
