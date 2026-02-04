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
  ngayKetThucKyHanVay?: string;

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
  checkGhiChu?: boolean;
  ghiChu?: string;
  choVay?: string;
  loaiVay?: string;
  fileAvatarUrls?: FileMetadataEntity[] = [];
  // avatars?: FileMetadataEntity[] = [];
  tableRequest?: TableRequest;
  table1?: TableRequest;
  table2?: TableRequest;
  table3?: TableRequest;
  checkOption?: boolean;
  soHopDongTD?: string;
  checkNguoiDungTenBiaDo2?:boolean;
  //Đứng tên bìa đỏ 1
  dungTenBiaDo1?: string;
  gioiTinhDungTenBiaDo1?: string;
  namSinhDungTenBiaDo1?: string;
  phoneDungTenBiaDo1?: string;
  cccdDungTenBiaDo1?: string;
  ngayCapCCCDDungTenBiaDo1?: string;
  diaChiThuongTruDungTenBiaDo1?: string;

  dungTenBiaDo2?:string;
  gioiTinhDungTenBiaDo2?:string;
  namSinhDungTenBiaDo2?:string;
  cccdDungTenBiaDo2?:string;
  ngayCapCCCDDungTenBiaDo2?:string;
  diaChiThuongTruDungTenBiaDo2?:string;

  landItems?:string;
  checkNhaCoDinh?:boolean;
  nhaCoDinh?:string;
  tongTaiSanBD?:string;
  tongTaiSanBDChu?:string;
  thoiHanVay?: string;
  checkMucDich?: boolean;
  checkLoaiDat?: boolean;
  checkNguonGocSuDung?: boolean;
  loaiDat?: string;
  checkNguoiMangTenBiaDo?: boolean;
  nguoiMangTen?: string;
  noiCapCCCDNguoiThan?: string;
  noiCapCCCDKhachHang?: string;
  noiCapCCCDDungTenBiaDo1?: string;
  noiCapCCCDDungTenBiaDo2?: string;
  ngayTheChap?: string;
  soBBXetDuyetChoVay?: string;
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
              soHopDongTD?: string, checkGhiChu?: boolean, ngayKetThucKyHanVay?: string,
              checkNguoiDungTenBiaDo2?:boolean, dungTenBiaDo1?: string, dungTenBiaDo2?: string, landItems?:string,
              checkNhaCoDinh?:boolean, nhaCoDinh?:string, tongTaiSanBD?:string,tongTaiSanBDChu?:string, thoiHanVay?:string,
            ) {
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
    // this.choVay =choVay;
    // this.loaiVay = loaiVay;
    // this.checkOption = checkOption;
    this.soHopDongTD = soHopDongTD;
    this.checkGhiChu = checkGhiChu;
    this.ngayKetThucKyHanVay = ngayKetThucKyHanVay;
    this.checkNguoiDungTenBiaDo2 = checkNguoiDungTenBiaDo2;
    this.dungTenBiaDo1 = dungTenBiaDo1;
    this.dungTenBiaDo2 = dungTenBiaDo2;
    this.landItems = landItems;
    this.checkNhaCoDinh= checkNhaCoDinh;
    this.nhaCoDinh = nhaCoDinh;
    this.tongTaiSanBD = tongTaiSanBD;
    this.tongTaiSanBDChu = tongTaiSanBDChu;
    this.thoiHanVay = thoiHanVay;
  }
}
