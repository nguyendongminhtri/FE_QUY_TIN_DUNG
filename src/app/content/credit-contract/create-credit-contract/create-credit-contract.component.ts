import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CreditContractService} from "../../../service/credit-contract.service";
import {CreditContract} from "../../../model/CreditContract";
import {ConvertMoney} from "../../../config/ConvertMoney";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UploadMultipleAvatarService} from "../../../service/upload-multiple-avatar.service";
import {FileMetadataEntity} from "../../../model/FileMetadataEntity";
import {ActivatedRoute} from "@angular/router";
import {MergeInfo, TableRequest} from "../../../model/TableRequest";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {Subscription} from "rxjs";
const COLUMN_ORDER = ['stt', 'danhMuc', 'donVi', 'soLuong', 'donGia'];
@Component({
  selector: 'app-create-credit-contract',
  templateUrl: './create-credit-contract.component.html',
  styleUrls: ['./create-credit-contract.component.css']
})
export class CreateCreditContractComponent implements OnInit {
  private mergeSubscriptions: { [key: number]: Subscription[] } = {};
  formGroup!: FormGroup;
  fileUrls: string[] = [];
  fileAvatarUrls: FileMetadataEntity[] = [];
  tienChu: string = '';
  contractId?: number;
  mode: 'create' | 'update' = 'create';
  tableData: TableRequest | null = null;
  tongTaiSanBD: string = '';
  tongTaiSanBDChu: string = '';
  titleNguoiBaoLanh1 = '';
  titleNguoiBaoLanh2 = '';
  contractUpdate: any;
  phuong = ''
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private creditContractService: CreditContractService,
    private uploadService: UploadMultipleAvatarService,
    private convertMoney: ConvertMoney,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    console.log('this mode --------------=======>', this.mode);
    // Lấy id từ route
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.contractId = Number(idParam);
      this.mode = 'update';
    }

    // Khởi tạo form
    this.initForm();

    // Đồng bộ các field tự động
    this.setupSyncFields();

    // Nếu là update, load dữ liệu cũ
    if (this.mode === 'update' && this.contractId) {
      this.creditContractService.getContractById(this.contractId).subscribe(contract => {
        console.log('contract::::', contract);
        this.contractUpdate = contract;
        // Patch các field đơn giản
        this.patchSimpleFields(contract);

        // Đồng bộ ngay sau khi patch dữ liệu
        const soHopDongValue = this.formGroup.get('soHopDongTD')?.value;
        if (soHopDongValue) {
          const parts = soHopDongValue.split('/');
          const lastPart = parts[parts.length - 1];
          const currentYear = new Date().getFullYear();
          this.formGroup.get('soBBXetDuyetChoVay')?.setValue(`${lastPart}/${currentYear}`, { emitEvent: false });
        }
// Lặp qua từng tài sản để load table1, table2, table3
        const taiSanArray = contract.taiSanArray;
        if (taiSanArray && taiSanArray.length > 0) {
          taiSanArray.forEach((asset, index) => {
            const tsGroup = (this.formGroup.get('taiSanArray') as FormArray).at(index) as FormGroup;

            this.loadTableArrayForAsset(asset.table1, tsGroup, 8, 'table1');
            this.loadTableArrayForAsset(asset.table2, tsGroup, 8, 'table2');
            this.loadTableArrayForAsset(asset.table3, tsGroup, 8, 'table3');
          });
        }
        this.loadTableArray(contract.hanMucTable, this.hanMucTable, 7, 'table1');
        this.loadChiPhiTable(contract.chiPhiTable, this.chiPhiTable);
        this.loadThuNhapTable(contract.thuNhapDuKienTable, this.thuNhapTable);
        this.loadPhuLucHanMucTableArray(contract.phuLucHanMucTable, this.phuLucHanMucTable)
        this.fileAvatarUrls = contract.fileAvatarUrls ?? [];
        this.applyConditionalControls(contract);

        if (contract.contractDate) {
          this.formGroup.get('contractDate')?.setValue(new Date(contract.contractDate));
        }
        if (contract.ngayTheChap) {
          this.formGroup.get('ngayTheChap')?.setValue(new Date(contract.ngayTheChap));
        }
        if (contract.pavvRequest?.ngayGiaiNgan) {
          this.formGroup.get('ngayGiaiNgan')?.setValue(new Date(contract.pavvRequest.ngayGiaiNgan));
        }
        // if (contract.ngayBaoDam) {
        //   this.formGroup.get('ngayBaoDam')?.setValue(new Date(contract.ngayBaoDam));
        // }
        if (contract.tableRequest) {
          this.loadTableRequest(contract.tableRequest);
        }
      });
    } else {
      this.initThuNhapTable();
      this.addChiPhiRow();
      this.addPhuLucHanMucRow();
      this.initPhuLucHanMucTable();
    }

    // Các listener khác
    this.setupValueChangeListeners();

    // Khởi tạo bảng rỗng nếu cần
    this.initTables();
    const lastRow = this.chiPhiTable.at(this.chiPhiTable.length - 1) as FormGroup;
    lastRow.get('thanhTien')?.valueChanges.subscribe(() => {
      this.syncTongVonToPavvRequest();
      this.syncTongVonLuuDong();
    });
    // Gọi ngay sau khi tạo form để set địa chỉ mặc định
    this.onNguoiDaiDienChange(this.formGroup.get('nguoiDaiDien')?.value);
    //TẠO HEADER table HDTD
    // Lắng nghe thay đổi của loaiVay
    this.formGroup.get('loaiVay')?.valueChanges.subscribe(value => {
      const headers = this.formGroup.get('tableHeaders') as FormArray;
      headers.clear(); // xoá các header cũ

      if (value === 'ngan_han') {
        headers.push(this.fb.control('Kế hoạch trả nợ'));
        headers.push(this.fb.control('Ngày, tháng, năm trả nợ'));
        headers.push(this.fb.control('Số tiền phải trả'));
      } else if (value === 'trung_han') {
        headers.push(this.fb.control('Kỳ trả nợ'));
        headers.push(this.fb.control('Đến ngày, tháng, năm'));
        headers.push(this.fb.control('Số tiền phải trả'));
      }
    });

    // Gọi ngay để set header mặc định theo giá trị ban đầu
    this.formGroup.get('loaiVay')?.updateValueAndValidity();
    this.updateDiaChiThuaDat(this.formGroup.get('nguoiDaiDien')?.value);
  }

  /* ---------- Helper methods ---------- */

  private initForm(): void {
    console.log('-------------INIT FORM---------------');
    this.formGroup = this.fb.group({
      // Trường chung của hợp đồng
      contractDate: [new Date()],
      ngayTheChap: [new Date()],
      soHopDongTD: ['01/25/232'],
      nguoiDaiDien: ['gd'],
      tenKhachHang: [''],
      gtkh: [''],
      namSinhKhachHang: [''],
      phoneKhachHang: [''],
      soTheThanhVienKhachHang: [''],
      cccdKhachHang: [''],
      ngayCapCCCDKhachHang: [''],
      diaChiThuongTruKhachHang: [''],
      gtnt: [''],
      tenNguoiThan: [''],
      namSinhNguoiThan: [''],
      cccdNguoiThan: [''],
      ngayCapCCCDNguoiThan: [''],
      diaChiThuongTruNguoiThan: [''],
      quanHe: ['Là vợ'],
      tienSo: [''],
      muchDichVay: [''],
      soBBXetDuyetChoVay: [''],
      hanMuc: ['12'],
      laiSuat: ['9,5%/năm'],
      ngayKetThucKyHanVay: [''],
      thoiHanVay: ['01'],
      soBienBanDinhGia: ['07/006/BBĐG'],
      noiCapCCCDNguoiThan: [''],
      noiCapCCCDKhachHang: [''],
      loaiVay: [{value: '', disabled: true}],
      choVay: [{value: 'Cho vay:', disabled: true}],
      checkOption: [false],
      checkNhaCoDinh: [false],
      hasTable: [false],
      tableHeaders: this.fb.array([]),
      tableRows: this.fb.array([]),
      // Phương án vay vốn
      pavvRequest: this.fb.group({
        name: [''],
        address: [''],
        checkAddress: [false],
        reason: [''],
        tongVon: [''],
        tongVonLuuDong: [''],
        vonTuCo: [''],
        vonKhac: [''],
        reLoanSequence: [0],
        vayLai: [false],
        giaiNganHM: [false],
        heSoVonKhac: [0],
        nguoiChuyenKhoan: ['Chuyển khoản cho bà: ....................; CCCD Số: .....................; Cấp ngày: ..............; Nơi cấp: Cục Cảnh Sát QLHC về TTXH; Số tài khoản: ...................................; Tại ngân hàng: ................... chi nhánh .................'],
        loaiPhuongAn: [''],
        duNoTruoc: [0],
        soTienVayLanNay: [0],
        soGiaiNgan: [0],
        ngayGiaiNgan: [new Date()],
        ngayHDTDCu: [''],
        soHDTDCu: [''],
        ngayThuLaiHM: ['']
      }),

      // // Các bảng phụ
      // table1: this.fb.array<FormGroup>([]),
      // table2: this.fb.array<FormGroup>([]),
      // table3: this.fb.array<FormGroup>([]),
      hanMucTable: this.fb.array([]),
      chiPhiTable: this.fb.array([]),
      thuNhapTable: this.fb.array([]),
      phuLucHanMucTable: this.fb.array([]),

      // Danh sách tài sản
      taiSanArray: this.fb.array([this.taoTaiSan()])
    });

    // Lắng nghe thay đổi của nguoiDaiDien
    this.formGroup.get('nguoiDaiDien')?.valueChanges.subscribe(value => {
      if (value === 'gd') {
        this.phuong = 'Thái Học';
      } else if (value === 'pgd') {
        this.phuong = 'Lê Đại Hành';
      } else {
        this.phuong = '';
      }
    });

    // Đăng ký lắng nghe cho tất cả tài sản hiện có
    this.taiSanArray.controls.forEach(ts => this.listenAssetChanges(ts as FormGroup));
  }



  // Toggle merge
  toggleMerge(index: number, event: any) {
    const checked = event.target.checked;
    const row = this.chiPhiRows[index];
    row.patchValue({ merge: checked });

    if (!checked) {
      row.patchValue({ mergeTargets: [], mergedValue: '' });
    }
  }
  private setupSyncFields(): void {
    // Đồng bộ Khách hàng -> Người đứng tên bìa đỏ 1
    this.syncField('tenKhachHang', 'dungTenBiaDo1');
    this.syncField('gtkh', 'gioiTinhDungTenBiaDo1');
    this.syncField('namSinhKhachHang', 'namSinhDungTenBiaDo1');
    this.syncField('phoneKhachHang', 'phoneDungTenBiaDo1');
    this.syncField('cccdKhachHang', 'cccdDungTenBiaDo1');
    this.syncField('ngayCapCCCDKhachHang', 'ngayCapCCCDDungTenBiaDo1');
    this.syncField('diaChiThuongTruKhachHang', 'diaChiThuongTruDungTenBiaDo1');
    this.syncField('noiCapCCCDKhachHang', 'noiCapCCCDDungTenBiaDo1');

    // Đồng bộ Người thân -> Người đứng tên bìa đỏ 2
    this.syncField('tenNguoiThan', 'dungTenBiaDo2');
    this.syncField('gtnt', 'gioiTinhDungTenBiaDo2');
    this.syncField('namSinhNguoiThan', 'namSinhDungTenBiaDo2');
    this.syncField('cccdNguoiThan', 'cccdDungTenBiaDo2');
    this.syncField('ngayCapCCCDNguoiThan', 'ngayCapCCCDDungTenBiaDo2');
    this.syncField('diaChiThuongTruNguoiThan', 'diaChiThuongTruDungTenBiaDo2');
    this.syncField('noiCapCCCDNguoiThan', 'noiCapCCCDDungTenBiaDo2');

    // Ví dụ xử lý đặc biệt: tự động sinh số BB xét duyệt từ số hợp đồng
    const soHopDongCtrl = this.formGroup.get('soHopDongTD');
    const soBBXetDuyetCtrl = this.formGroup.get('soBBXetDuyetChoVay');

    if (soHopDongCtrl && soBBXetDuyetCtrl) {
      soHopDongCtrl.valueChanges.subscribe(value => {
        if (value) {
          const parts = value.split('/');
          const lastPart = parts[parts.length - 1];
          const currentYear = new Date().getFullYear();
          const newValue = `${lastPart}/${currentYear}`;
          soBBXetDuyetCtrl.setValue(newValue, { emitEvent: false });
        } else {
          soBBXetDuyetCtrl.setValue('', { emitEvent: false });
        }
      });
    }
  }


  private patchSimpleFields(contract: any): void {
    // Patch những field đơn giản, tránh patch toàn bộ object
    this.formGroup.patchValue({
      soHopDongTD: contract.soHopDongTD,
      nguoiDaiDien: contract.nguoiDaiDien,
      tenKhachHang: contract.tenKhachHang,
      thoiHanVay: contract.thoiHanVay,
      gtkh: contract.gtkh,
      noiDungNgoaiBia: contract.noiDungNgoaiBia,
      namSinhKhachHang: contract.namSinhKhachHang,
      phoneKhachHang: contract.phoneKhachHang,
      soTheThanhVienKhachHang: contract.soTheThanhVienKhachHang,
      cccdKhachHang: contract.cccdKhachHang,
      ngayCapCCCDKhachHang: contract.ngayCapCCCDKhachHang,
      diaChiThuongTruKhachHang: contract.diaChiThuongTruKhachHang,
      gtnt: contract.gtnt,
      tenNguoiThan: contract.tenNguoiThan,
      namSinhNguoiThan: contract.namSinhNguoiThan,
      cccdNguoiThan: contract.cccdNguoiThan,
      noiCapCCCDKhachHang: contract.noiCapCCCDKhachHang,
      ngayCapCCCDNguoiThan: contract.ngayCapCCCDNguoiThan,
      noiCapCCCDNguoiThan: contract.noiCapCCCDNguoiThan,
      soBBXetDuyetChoVay: contract.soBBXetDuyetChoVay,
      diaChiThuongTruNguoiThan: contract.diaChiThuongTruNguoiThan,
      dungTenBiaDo1: contract.dungTenBiaDo1,
      gioiTinhDungTenBiaDo1: contract.gioiTinhDungTenBiaDo1,
      namSinhDungTenBiaDo1: contract.namSinhDungTenBiaDo1,
      cccdDungTenBiaDo1: contract.cccdDungTenBiaDo1,
      ngayCapCCCDDungTenBiaDo1: contract.ngayCapCCCDDungTenBiaDo1,
      noiCapCCCDDungTenBiaDo1: contract.noiCapCCCDDungTenBiaDo1,
      diaChiThuongTruDungTenBiaDo1: contract.diaChiThuongTruDungTenBiaDo1,
      quanHe: contract.quanHe,
      tienSo: contract.tienSo,
      // tienChu: contract.tienChu,
      muchDichVay: contract.muchDichVay,
      hanMuc: contract.hanMuc,
      laiSuat: contract.laiSuat,
      soHopDongTheChapQSDD: contract.soHopDongTheChapQSDD,
      // serial: contract.serial,
      // noiCapSo: contract.noiCapSo,
      // ngayCapSo: contract.ngayCapSo,
      // noiDungVaoSo: contract.noiDungVaoSo,
      // soThuaDat: contract.soThuaDat,
      // soBanDo: contract.soBanDo,
      // diaChiThuaDat: contract.diaChiThuaDat,
      // dienTichDatSo: contract.dienTichDatSo,
      // dienTichDatChu: contract.dienTichDatChu,
      // hinhThucSuDung: contract.hinhThucSuDung,
      // thoiHanSuDung: contract.thoiHanSuDung,
      soBienBanDinhGia: contract.soBienBanDinhGia,
      noiDungThoaThuan: contract.noiDungThoaThuan,
      // nguonGocSuDung: contract.nguonGocSuDung,
      // ghiChu: contract.ghiChu,
      choVay: contract.choVay,
      loaiVay: contract.loaiVay,
      checkOption: contract.checkOption,
      // checkGhiChu: contract.checkGhiChu,
      // checkNguonGocSuDung: contract.checkNguonGocSuDung,
      // checkNhaCoDinh: contract.checkNhaCoDinh,
      // checkLoaiDat: contract.checkLoaiDat,
      // checkMucDich: contract.checkMucDich,
      // checkNguoiDungTenBiaDo2: contract.checkNguoiDungTenBiaDo2,
      // checkHopDongBaoLanh: contract.checkHopDongBaoLanh,
      // landItems: contract.landItems,
      hasTable: contract.tableRequest?.drawTable ?? false,
      // tsbdRequest: {
      //   checkTaiSanGanLienVoiDat: contract.tsbdRequest?.checkTaiSanGanLienVoiDat ?? false,
      //   dienTichTS: contract.tsbdRequest?.dienTichTS ?? '',
      //   ketCauXayDung: contract.tsbdRequest?.ketCauXayDung ?? '',
      //   loaiNha: contract.tsbdRequest?.loaiNha ?? '',
      //   checkCMNDDungTenBiaDo1: contract.tsbdRequest?.checkCMNDDungTenBiaDo1 ?? false,
      //   cmndDungTenBiaDo1: contract.tsbdRequest?.cmndDungTenBiaDo1 ?? '',
      //   checkNgayCapCCCDTruocDayDungTenBiaDo1: contract.tsbdRequest?.checkNgayCapCCCDTruocDayDungTenBiaDo1 ?? false,
      //   ngayCapCCCDTruocDayDungTenBiaDo1: contract.tsbdRequest?.ngayCapCCCDTruocDayDungTenBiaDo1 ?? '',
      //   checkCMNDDungTenBiaDo2: contract.tsbdRequest?.checkCMNDDungTenBiaDo2 ?? false,
      //   cmndDungTenBiaDo2: contract.tsbdRequest?.cmndDungTenBiaDo2 ?? '',
      //   checkNgayCapCCCDTruocDayDungTenBiaDo2: contract.tsbdRequest?.checkNgayCapCCCDTruocDayDungTenBiaDo2 ?? false,
      //   ngayCapCCCDTruocDayDungTenBiaDo2: contract.tsbdRequest?.ngayCapCCCDTruocDayDungTenBiaDo2 ?? '',
      //   checkDiaChiThuongTruDungTenBiaDo1: contract.tsbdRequest?.checkDiaChiThuongTruDungTenBiaDo1 ?? false,
      //   diaChiThuongTruDungTenBiaDo1: contract.tsbdRequest?.diaChiThuongTruDungTenBiaDo1 ?? '',
      //   checkDiaChiThuongTruDungTenBiaDo2: contract.tsbdRequest?.checkDiaChiThuongTruDungTenBiaDo2 ?? false,
      //   diaChiThuongTruDungTenBiaDo2: contract.tsbdRequest?.diaChiThuongTruDungTenBiaDo2 ?? '',
      //   checkChiMangTenNguoi1: contract.tsbdRequest?.checkChiMangTenNguoi1 ?? false,
      //   checkChiMangTenNguoi2: contract.tsbdRequest?.checkChiMangTenNguoi2 ?? false
      // },
      pavvRequest: {
        checkAddress: contract.pavvRequest?.checkAddress ?? false,
        name: contract.pavvRequest?.name ?? '',
        address: contract.pavvRequest?.address ?? '',
        reason: contract.pavvRequest?.reason ?? '',
        tongVon: contract.pavvRequest?.tongVon ?? '',
        tongVonLuuDong: contract.pavvRequest?.tongVonLuuDong ?? '',
        vonTuCo: contract.pavvRequest?.vonTuCo ?? '',
        vonKhac: contract.pavvRequest?.vonKhac ?? '',
        vayLai: contract.pavvRequest?.vayLai ?? '',
        giaiNganHM: contract.pavvRequest?.giaiNganHM ?? '',
        reLoanSequence: contract.pavvRequest?.reLoanSequence ?? '',
        heSoVonTuCo: contract.pavvRequest?.heSoVonTuCo ?? '',
        nguoiChuyenKhoan: contract.pavvRequest?.nguoiChuyenKhoan ?? '',
        loaiPhuongAn: contract.pavvRequest?.loaiPhuongAn ?? '',
        duNoTruoc: contract.pavvRequest?.duNoTruoc ?? '',
        soTienVayLanNay: contract.pavvRequest?.soTienVayLanNay ?? '',
        heSoVonKhac: contract.pavvRequest?.heSoVonKhac ?? '',
        soGiaiNgan: contract.pavvRequest?.soGiaiNgan ?? '',
        ngayHDTDCu: contract.pavvRequest?.ngayHDTDCu ?? '',
        soHDTDCu: contract.pavvRequest?.soHDTDCu ?? '',
        ngayThuLaiHM: contract.pavvRequest?.ngayThuLaiHM ?? '',
      }
    });
    this.tienChu = contract.tienChu || '';
    // Patch cho từng tài sản trong array
    (contract.taiSanArray || []).forEach((asset: any, index: number) => {
      // Nếu chưa có FormGroup tương ứng thì thêm mới
      if (this.taiSanArray.length <= index) {
        this.taiSanArray.push(this.taoTaiSan());
      }

      const tsGroup = this.taiSanArray.at(index) as FormGroup;
      tsGroup.patchValue({
        soHopDongTheChapQSDD: asset.soHopDongTheChapQSDD,
        serial: asset.serial,
        noiDungNgoaiBia: asset.noiDungNgoaiBia,
        noiCapSo: asset.noiCapSo,
        ngayCapSo: asset.ngayCapSo,
        noiDungVaoSo: asset.noiDungVaoSo,
        soThuaDat: asset.soThuaDat,
        landItems: asset.landItems,
        soBanDo: asset.soBanDo,
        diaChiThuaDat: asset.diaChiThuaDat,
        dienTichDatSo: asset.dienTichDatSo,
        dienTichDatChu: asset.dienTichDatChu,
        hinhThucSuDung: asset.hinhThucSuDung,
        muchDichSuDung: asset.muchDichSuDung,
        loaiDat: asset.loaiDat,
        thoiHanSuDung: asset.thoiHanSuDung,
        noiDungThoaThuan: asset.noiDungThoaThuan,
        nguonGocSuDung: asset.nguonGocSuDung,
        tongTaiSanBD: asset.tongTaiSanBD,
        tongTaiSanBDChu: asset.tongTaiSanBDChu,
        ghiChu: asset.ghiChu,
        checkMucDich: asset.checkMucDich,
        checkLoaiDat: asset.checkLoaiDat,
        checkNguonGocSuDung: asset.checkNguonGocSuDung,
        checkGhiChu: asset.checkGhiChu,
        checkTaiSanGanLienVoiDat: asset.checkTaiSanGanLienVoiDat,
        dienTichTS: asset.dienTichTS,
        checkDongSoHuu: asset.checkDongSoHuu,
        loaiNha: asset.loaiNha,
        ketCauXayDung: asset.ketCauXayDung,
        ngayTheChap: asset.ngayTheChap ? new Date(asset.ngayTheChap) : null
      }, { emitEvent: false });
    });
  }

  private syncTongVonToPavvRequest(): void {
    if (this.chiPhiTable.length === 0) return;

    const lastRow = this.chiPhiTable.at(this.chiPhiTable.length - 1) as FormGroup;
    const tongVon = lastRow.get('thanhTien')?.value;

    (this.formGroup.get('pavvRequest') as FormGroup)
      .get('tongVon')
      ?.setValue(tongVon);
  }

  private syncTongVonLuuDong(): void {
    if (this.chiPhiTable.length < 2) return;

    const lastRow = this.chiPhiTable.at(this.chiPhiTable.length - 1) as FormGroup;
    const prevRow = this.chiPhiTable.at(this.chiPhiTable.length - 2) as FormGroup;

    const tongVonStr = lastRow.get('thanhTien')?.value || '0';
    const prevStr = prevRow.get('thanhTien')?.value || '0';

    const tongVon = parseFloat(tongVonStr.toString().replace(/\./g, ''));
    const prevValue = parseFloat(prevStr.toString().replace(/\./g, ''));

    const tongVonLuuDong = tongVon - prevValue;

    (this.formGroup.get('pavvRequest') as FormGroup)
      .get('tongVonLuuDong')
      ?.setValue(this.formatNumber(tongVonLuuDong)); // dùng lại hàm formatNumber
  }


  private loadTableRequest(tableRequest: any): void {
    if (!tableRequest) {
      this.tableData = null;
      return;
    }

    this.tableData = tableRequest;

    // headers
    this.tableHeaders.clear();
    (tableRequest.headers || []).forEach((h: string) => {
      this.tableHeaders.push(this.fb.control(h));
    });

    // rows
    this.tableRows.clear();
    (tableRequest.rows || []).forEach((r: any[]) => {
      this.tableRows.push(this.fb.group({
        col1: [r[0] || ''],
        col2: [r[1] || ''],
        col3: [r[2] || '']
      }));
    });

    // set hasTable control
    this.formGroup.patchValue({hasTable: !!tableRequest.drawTable});
  }
  private parseNumber(val: any): number {
    if (val == null) return 0;

    if (typeof val === 'number') {
      return val;
    }

    if (typeof val === 'string') {
      return Number(val.replace(/\./g, '')) || 0;
    }

    return 0;
  }


  loadChiPhiTable(
    tableData: { rows: string[][], merges?: MergeInfo[] } | undefined,
    formArray: FormArray
  ) {
    formArray.clear();
    if (!tableData || !tableData.rows) {
      return;
    }

    tableData.rows.forEach((rowData, idx) => {
      const mergeInfo = tableData.merges?.find(m => m.rowIndex === idx);

      const soLuong = this.parseNumber(rowData[3]);
      const donGia = this.parseNumber(rowData[4]);
      const thanhTien = rowData[5] ? this.parseNumber(rowData[5]) : soLuong * donGia;

      const group = this.fb.group({
        stt: [rowData[0] || ''],
        danhMuc: [rowData[1] || ''],
        donVi: [rowData[2] || ''],
        soLuong: [soLuong],
        donGia: [donGia],
        thanhTien: [thanhTien],

        merge: [!!mergeInfo],
        mergeTargets: [mergeInfo?.mergeTargets || []],
        mergedValue: [mergeInfo?.mergedValue || ''],
        sum: [false],
        sumTargets: [[]]
      });

      formArray.push(group);
    });
  }


  //
  loadTableArray(
    tableData: { rows: string[][] } | undefined,
    table: FormArray,
    colCount: number,
    tableType: 'table1' | 'table2' | 'table3'
  ) {
    table.clear();
    if (!tableData || !tableData.rows) {
      return;
    }

    tableData.rows.forEach((rowData, rowIndex) => {
      // Nếu là table1 và row thứ 2 thì khởi tạo với mặc định col2 = '85.000'
      const defaultValues: any = { col4: 'x', col6: 'm²' };
      if (tableType === 'table1' && rowIndex === 1) {
        defaultValues.col2 = '140.000';
      }

      const row = this.createRow(defaultValues);

      // Patch dữ liệu vào các cột
      for (let i = 0; i < colCount; i++) {
        const key = `col${i + 1}`;
        const value = rowData[i];
        console.log(`Row ${rowIndex} key=${key}, incoming value=`, value);

        if (tableType === 'table1' && rowIndex === 1 && key === 'col2') {
          if (value && value !== '0') {
            row.get(key)?.setValue(value);
          }
        } else {
          if (value !== undefined && value !== null && value !== '') {
            row.get(key)?.setValue(value);
          }
        }
      }

      // Đăng ký sự kiện và cập nhật theo loại bảng
      if (tableType === 'table1') {
        row.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row));
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row));
        this.updateTable1Row(row);
      }

      if (tableType === 'table2') {
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row));
        row.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row));
        this.updateTable2Row(row);
      }

      if (tableType === 'table3') {
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable3Row(row));
        row.get('col7')?.valueChanges.subscribe(() => this.updateTable3Row(row));
        this.updateTable3Row(row);
      }

      table.push(row);
    });

    // ✅ Sau khi load xong, đảm bảo row2 của table1 luôn có col2 = '85.000'
    if (tableType === 'table1' && table.length > 1) {
      const row2 = table.at(1) as FormGroup;
      if (!row2.get('col2')?.value || row2.get('col2')?.value === '0') {
        row2.get('col2')?.setValue('140.000', { emitEvent: false });
      }
      console.log('== After loadTableArray ==');
      console.log('Row2 col2 final value:', row2.get('col2')?.value);
      console.log('Row2 col4 final value:', row2.get('col4')?.value);
      console.log('Row2 col6 final value:', row2.get('col6')?.value);
    }
  }

  loadTableArrayForAsset(
    tableData: { rows: string[][] } | undefined,
    tsGroup: FormGroup,
    colCount: number,
    tableType: 'table1' | 'table2' | 'table3'
  ) {
    const table = tsGroup.get(tableType) as FormArray;
    table.clear();

    if (!tableData || !tableData.rows) {
      return;
    }

    tableData.rows.forEach((rowData, rowIndex) => {
      const defaultValues: any = { col4: 'x', col6: 'm²' };
      if (tableType === 'table1' && rowIndex === 0) {
        defaultValues.col1 = 'Giá đất ở của nhà nước quy định';
        defaultValues.col2 = '6.000.000';
        defaultValues.col3 = 'đ/m²';
        defaultValues.col4 = 'x';
        defaultValues.col6 = 'm²';
        defaultValues.col8 = 'VNĐ';
      }
      if (tableType === 'table1' && rowIndex === 1) {
        defaultValues.col1 = 'Giá đất khác';
        defaultValues.col2 = '140.000';
        defaultValues.col3 = 'đ/m²';
        defaultValues.col4 = 'x';
        defaultValues.col6 = 'm²';
        defaultValues.col8 = 'VNĐ';
      }


      const row = this.createRow(defaultValues);

      // Patch dữ liệu vào các cột, ưu tiên dữ liệu từ rowData, nếu không có thì dùng defaultValues
      for (let i = 0; i < colCount; i++) {
        const key = `col${i + 1}`;
        const value = rowData[i];

        if (value !== undefined && value !== null && value !== '') {
          row.get(key)?.setValue(value);
        } else if (defaultValues[key] !== undefined) {
          row.get(key)?.setValue(defaultValues[key]);
        }
      }

      // Đăng ký sự kiện và cập nhật theo loại bảng
      if (tableType === 'table1') {
        row.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row));
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row));
        this.updateTable1Row(row);
      }

      if (tableType === 'table2') {
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row));
        row.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row));
        this.updateTable2Row(row);
      }

      if (tableType === 'table3') {
        row.get('col5')?.valueChanges.subscribe(() => this.updateTable3Row(row));
        row.get('col7')?.valueChanges.subscribe(() => this.updateTable3Row(row));
        this.updateTable3Row(row);
      }

      table.push(row);
    });

    // ✅ Sau khi load xong, đảm bảo row2 của table1 luôn có col2 = '140.000'
    if (tableType === 'table1' && table.length > 1) {
      const row2 = table.at(1) as FormGroup;
      if (!row2.get('col2')?.value || row2.get('col2')?.value === '0' || row2.get('col2')?.value === '') {
        row2.get('col2')?.setValue('140.000', { emitEvent: false });
      }
    }
  }



//CẬP NHẬT THÔNG TIN TABLE1  XÁC ĐỊNH GIÁ TRỊ TSBĐ
  updateTable1Row(row: FormGroup) {
    const col2 = this.parseNumber(row.get('col2')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    if (!col2 || !col5) return;   // 👈 cùng pattern — bỏ qua khi thiếu dữ liệu, không reset col7
    const result = col2 * col5;
    row.get('col7')?.setValue(result.toLocaleString('vi-VN'), { emitEvent: false });
  }



  private parseArea(val: any): number {
    if (val == null) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // thay dấu phẩy thành dấu chấm để thống nhất
      val = val.replace(/,/g, '.').trim();
      return Number(val) || 0;
    }
    return 0;
  }

  private parseCurrency(val: any): number {
    if (val == null) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // bỏ dấu chấm phân cách nghìn
      return Number(val.replace(/\./g, '').trim()) || 0;
    }
    return 0;
  }


  // updateTableFromLandItems(table: FormArray, updateRowFn: (row: FormGroup) => void) {
  //   const landItems = this.formGroup.get('landItems')?.value;
  //   if (!landItems) return;
  //
  //   const regexArea = /:\s*([\d\.]+)\s*m²/g;
  //   const regexValue = /được định giá(?: là)?:\s*([\d\.]+)/g;
  //
  //   let firstArea = 0, totalOtherArea = 0;
  //   let firstValue = 0, totalOtherValue = 0;
  //
  //   const matchesArea = [...landItems.matchAll(regexArea)];
  //   const matchesValue = [...landItems.matchAll(regexValue)];
  //
  //   matchesArea.forEach((match, index) => {
  //     const value = this.parseArea(match[1]); // giữ đúng số thập phân
  //     if (index === 0) firstArea = value;
  //     else totalOtherArea += value;
  //   });
  //
  //   matchesValue.forEach((match, index) => {
  //     const value = this.parseCurrency(match[1]); // đúng số tiền lớn
  //     if (index === 0) firstValue = value;
  //     else totalOtherValue += value;
  //   });
  //
  //   if (table.length > 0) {
  //     const firstRow = table.at(0) as FormGroup;
  //     firstRow?.get('col5')?.setValue(firstArea || 0, { emitEvent: false });
  //     firstRow?.get('col7')?.setValue(this.formatCurrency(firstValue || 0), { emitEvent: false });
  //     updateRowFn(firstRow);
  //   }
  //
  //   if (table.length > 1) {
  //     const secondRow = table.at(1) as FormGroup;
  //     secondRow?.get('col5')?.setValue(totalOtherArea || 0, { emitEvent: false });
  //     secondRow?.get('col7')?.setValue(this.formatCurrency(totalOtherValue || 0), { emitEvent: false });
  //     updateRowFn(secondRow);
  //   }
  // }
  private updateTableFromLandItems(table: FormArray, updateRowFn: (row: FormGroup) => void){
    const taiSanArray = this.formGroup.get('taiSanArray') as FormArray;
    taiSanArray.controls.forEach((tsGroup: AbstractControl) => {
      const landItems = (tsGroup as FormGroup).get('landItems')?.value;
      if (!landItems) return;

      const regexArea = /:\s*([\d\.]+)\s*m²/g;
      const regexValue = /được định giá(?: là)?:\s*([\d\.]+)/g;

      let firstArea = 0, totalOtherArea = 0;
      let firstValue = 0, totalOtherValue = 0;

      const matchesArea = [...landItems.matchAll(regexArea)];
      const matchesValue = [...landItems.matchAll(regexValue)];

      matchesArea.forEach((match, i) => {
        const value = this.parseArea(match[1]);
        if (i === 0) firstArea = value;
        else totalOtherArea += value;
      });

      matchesValue.forEach((match, i) => {
        const value = this.parseCurrency(match[1]);
        if (i === 0) firstValue = value;
        else totalOtherValue += value;
      });

      // ✅ Cập nhật table1
      const table1 = (tsGroup as FormGroup).get('table1') as FormArray;
      if (table1?.length > 0) {
        const row1 = table1.at(0) as FormGroup;
        row1.get('col5')?.setValue(firstArea || 0, { emitEvent: false });
        row1.get('col7')?.setValue(this.formatCurrency(firstValue || 0), { emitEvent: false });
        this.updateTable1Row(row1);
      }
      if (table1?.length > 1) {
        const row2 = table1.at(1) as FormGroup;
        row2.get('col5')?.setValue(totalOtherArea || 0, { emitEvent: false });
        row2.get('col7')?.setValue(this.formatCurrency(totalOtherValue || 0), { emitEvent: false });
        this.updateTable1Row(row2);
      }

      // ✅ Cập nhật table2
      const table2 = (tsGroup as FormGroup).get('table2') as FormArray;
      if (table2?.length > 0) {
        const row1 = table2.at(0) as FormGroup;
        row1.get('col5')?.setValue(firstArea || 0, { emitEvent: false });
        row1.get('col7')?.setValue(this.formatCurrency(firstValue || 0), { emitEvent: false });
        this.updateTable2Row(row1);
      }
      if (table2?.length > 1) {
        const row2 = table2.at(1) as FormGroup;
        row2.get('col5')?.setValue(totalOtherArea || 0, { emitEvent: false });
        row2.get('col7')?.setValue(this.formatCurrency(totalOtherValue || 0), { emitEvent: false });
        this.updateTable2Row(row2);
      }

      // ✅ Cập nhật table3 (logic giống table2)
      const table3 = (tsGroup as FormGroup).get('table3') as FormArray;
      if (table3?.length > 0) {
        const row1 = table3.at(0) as FormGroup;
        row1.get('col5')?.setValue(firstArea || 0, { emitEvent: false });
        row1.get('col7')?.setValue(this.formatCurrency(firstValue || 0), { emitEvent: false });
        this.updateTable3Row(row1);
      }
      if (table3?.length > 1) {
        const row2 = table3.at(1) as FormGroup;
        row2.get('col5')?.setValue(totalOtherArea || 0, { emitEvent: false });
        row2.get('col7')?.setValue(this.formatCurrency(totalOtherValue || 0), { emitEvent: false });
        this.updateTable3Row(row2);
      }
    });
  }

  updateTable2Row(row: FormGroup) {
    const col7 = this.parseNumber(row.get('col7')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    const result = col5 > 0 ? Math.round(col7 / col5) : 0;   // 👈 luôn có nhánh else
    row.get('col2')?.setValue(result.toLocaleString('vi-VN'), { emitEvent: false });
  }

  updateTable3Row(row: FormGroup) {
    const col7 = this.parseNumber(row.get('col7')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    const result = col5 > 0 ? Math.round(col7 / col5) : 0;   // 👈 luôn có nhánh else
    row.get('col2')?.setValue(result.toLocaleString('vi-VN'), { emitEvent: false });
  }


  private applyConditionalControls(contract: any): void {
    if (contract.checkOption) {
      this.formGroup.get('loaiVay')?.enable({ emitEvent: false });
      this.formGroup.get('choVay')?.enable({ emitEvent: false });
      this.formGroup.get('loaiVay')?.setValue(contract.loaiVay,{ emitEvent: false });
      this.formGroup.get('choVay')?.setValue(contract.choVay, { emitEvent: false });
    } else {
      this.formGroup.get('loaiVay')?.disable({ emitEvent: false });
      this.formGroup.get('choVay')?.disable({ emitEvent: false });
    }
    // if (contract.tsbdRequest?.checkTaiSanGanLienVoiDat) {
    //   this.formGroup.get('tsbdRequest.dienTichTS')?.enable();
    //   this.formGroup.get('tsbdRequest.ketCauXayDung')?.enable();
    //   this.formGroup.get('tsbdRequest.loaiNha')?.enable();
    //
    //   this.formGroup.get('tsbdRequest.dienTichTS')?.setValue(contract.tsbdRequest.dienTichTS);
    //   this.formGroup.get('tsbdRequest.ketCauXayDung')?.setValue(contract.tsbdRequest.ketCauXayDung);
    //   this.formGroup.get('tsbdRequest.loaiNha')?.setValue(contract.tsbdRequest.loaiNha);
    // } else {
    //   this.formGroup.get('tsbdRequest.dienTichTS')?.disable();
    //   this.formGroup.get('tsbdRequest.ketCauXayDung')?.disable();
    //   this.formGroup.get('tsbdRequest.loaiNha')?.disable();
    // }
    if (contract.pavvRequest?.checkAddress) {
      this.formGroup.get('pavvRequest.address')?.enable({ emitEvent: false });
      this.formGroup.get('pavvRequest.address')?.setValue(contract.pavvRequest.address,{ emitEvent: false });
    }
    // CHECK TS
    (contract.taiSanArray || []).forEach((asset: any, index: number) => {
      // Nếu chưa có FormGroup tương ứng thì thêm mới
      if (this.taiSanArray.length <= index) {
        this.taiSanArray.push(this.taoTaiSan());
      }

      const tsGroup = this.taiSanArray.at(index) as FormGroup;

      // Check Loại đất
      if (asset.checkLoaiDat) {
        tsGroup.get('loaiDat')?.enable({ emitEvent: false });
        tsGroup.get('loaiDat')?.setValue(asset.loaiDat, { emitEvent: false });
      } else {
        tsGroup.get('loaiDat')?.disable({ emitEvent: false });
      }

      // Check Mục đích sử dụng
      if (asset.checkMucDich) {
        tsGroup.get('muchDichSuDung')?.enable({ emitEvent: false });
        tsGroup.get('muchDichSuDung')?.setValue(asset.muchDichSuDung ,{ emitEvent: false });
      } else {
        tsGroup.get('muchDichSuDung')?.disable({ emitEvent: false });
      }

      // Check Nguồn gốc sử dụng
      if (asset.checkNguonGocSuDung) {
        tsGroup.get('nguonGocSuDung')?.enable({ emitEvent: false });
        tsGroup.get('nguonGocSuDung')?.setValue(asset.nguonGocSuDung, { emitEvent: false });
      } else {
        tsGroup.get('nguonGocSuDung')?.disable({ emitEvent: false });
      }

      // Check Ghi chú
      if (asset.checkGhiChu) {
        tsGroup.get('ghiChu')?.enable({ emitEvent: false });
        tsGroup.get('ghiChu')?.setValue(asset.ghiChu, { emitEvent: false });
      } else {
        tsGroup.get('ghiChu')?.disable({ emitEvent: false });
      }
    });

    // contract là dữ liệu bạn load từ API
    (contract.taiSanArray || []).forEach((taiSan: any, index: number) => {
      const tsGroup = (this.formGroup.get('taiSanArray') as FormArray).at(index) as FormGroup;

      if (taiSan.checkNguoiDungTenBiaDo2) {
        tsGroup.get('dungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('gioiTinhDungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('namSinhDungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('cccdDungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('ngayCapCCCDDungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('diaChiThuongTruDungTenBiaDo2')?.enable({ emitEvent: false });
        tsGroup.get('noiCapCCCDDungTenBiaDo2')?.enable({ emitEvent: false });

        tsGroup.get('dungTenBiaDo2')?.setValue(taiSan.dungTenBiaDo2, { emitEvent: false });
        tsGroup.get('gioiTinhDungTenBiaDo2')?.setValue(taiSan.gioiTinhDungTenBiaDo2, { emitEvent: false });
        tsGroup.get('namSinhDungTenBiaDo2')?.setValue(taiSan.namSinhDungTenBiaDo2, { emitEvent: false });
        tsGroup.get('cccdDungTenBiaDo2')?.setValue(taiSan.cccdDungTenBiaDo2, { emitEvent: false });
        tsGroup.get('ngayCapCCCDDungTenBiaDo2')?.setValue(taiSan.ngayCapCCCDDungTenBiaDo2, { emitEvent: false });
        tsGroup.get('noiCapCCCDDungTenBiaDo2')?.setValue(taiSan.noiCapCCCDDungTenBiaDo2, { emitEvent: false });
        tsGroup.get('diaChiThuongTruDungTenBiaDo2')?.setValue(taiSan.diaChiThuongTruDungTenBiaDo2, { emitEvent: false });
      }
    });

    if (contract.checkNguoiMangTenBiaDo) {
      this.formGroup.get('nguoiMangTen')?.enable({ emitEvent: false });
      this.formGroup.get('nguoiMangTen')?.setValue(contract.nguoiMangTen, { emitEvent: false });
    }

    if (contract.checkNhaCoDinh) {
      this.formGroup.get('nhaCoDinh')?.enable({ emitEvent: false });
      this.formGroup.get('nhaCoDinh')?.setValue(contract.nhaCoDinh, { emitEvent: false });
    }
  }

  private setupValueChangeListeners(): void {
    const taiSanArray = this.formGroup.get('taiSanArray') as FormArray;
    this.formGroup.get('checkOption')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.formGroup.get('loaiVay')?.enable();
        this.formGroup.get('choVay')?.enable();
      } else {
        this.formGroup.get('loaiVay')?.disable();
        this.formGroup.get('choVay')?.disable();
      }
    });

    taiSanArray.controls.forEach((ctrl: AbstractControl, index: number) => {
      const tsGroup = ctrl as FormGroup;

      // muchDichVay -> pavvRequest.name
      tsGroup.get('muchDichVay')?.valueChanges.subscribe(value => {
        tsGroup.get('pavvRequest.name')?.setValue(value, { emitEvent: false });
      });

      // ✅ Mục đích sử dụng -> sinh LandItems
      tsGroup.get('muchDichSuDung')?.valueChanges.subscribe(value => {
        if (!value) {
          tsGroup.get('landItems')?.setValue('', { emitEvent: false });
          return;
        }

        const regex = /\+\s*([^\:]+):\s*([\d\.]+)\s*m²/g;
        let result = '';
        let match;

        while ((match = regex.exec(value)) !== null) {
          const loaiDat = match[1].trim();   // ví dụ: "Đất ở tại đô thị"
          const dienTich = Number(match[2]); // ví dụ: 100
          const giaTri = dienTich * 10000000; // mặc định nhân 10 triệu

          const giaTriStr = new Intl.NumberFormat('vi-VN').format(giaTri);

          result += `+ ${loaiDat.replace('tại đô thị', '').trim()}: ${dienTich} m²; được định giá là: ${giaTriStr} đồng\n`;
        }

        tsGroup.get('landItems')?.setValue(result.trim(), { emitEvent: true });
      });
// Các checkbox khác (CMND, CCCD, địa chỉ…)
      tsGroup.get('checkCMNDDungTenBiaDo1')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('cmndDungTenBiaDo1');
        checked ? control?.enable() : control?.disable();
      });

      tsGroup.get('checkNgayCapCCCDTruocDayDungTenBiaDo1')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('ngayCapCCCDTruocDayDungTenBiaDo1');
        checked ? control?.enable() : control?.disable();
      });

      tsGroup.get('checkCMNDDungTenBiaDo2')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('cmndDungTenBiaDo2');
        checked ? control?.enable() : control?.disable();
      });

      tsGroup.get('checkNgayCapCCCDTruocDayDungTenBiaDo2')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('ngayCapCCCDTruocDayDungTenBiaDo2');
        checked ? control?.enable() : control?.disable();
      });

      tsGroup.get('checkDiaChiThuongTruDungTenBiaDo1')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('diaChiThuongTruDungTenBiaDo1');
        checked ? control?.enable() : control?.disable();
      });

      tsGroup.get('checkDiaChiThuongTruDungTenBiaDo2')?.valueChanges.subscribe(checked => {
        const control = tsGroup.get('diaChiThuongTruDungTenBiaDo2');
        checked ? control?.enable() : control?.disable();
      });


      // LandItems thay đổi -> tính toán lại cho từng tài sản
      tsGroup.get('landItems')?.valueChanges.subscribe(() => {
        this.calculateTongTaiSanBD(tsGroup);
        this.updateTableFromLandItems(tsGroup.get('table1') as FormArray, this.updateTable1Row.bind(this));
        this.updateTableFromLandItems(tsGroup.get('table2') as FormArray, this.updateTable2Row.bind(this));
        this.updateTableFromLandItems(tsGroup.get('table3') as FormArray, this.updateTable3Row.bind(this));
      });

      // Checkbox người đứng tên bìa đỏ 2
      tsGroup.get('checkNguoiDungTenBiaDo2')?.valueChanges.subscribe(checked => {
        const controls = [
          'dungTenBiaDo2',
          'gioiTinhDungTenBiaDo2',
          'namSinhDungTenBiaDo2',
          'cccdDungTenBiaDo2',
          'ngayCapCCCDDungTenBiaDo2',
          'noiCapCCCDDungTenBiaDo2',
          'diaChiThuongTruDungTenBiaDo2'
        ];
        controls.forEach(c => {
          const ctrl = tsGroup.get(c);
          checked ? ctrl?.enable() : ctrl?.disable();
        });
      });

      // const checkCtrl = tsGroup.get('tsbdRequest.checkTaiSanGanLienVoiDat');
      // checkCtrl?.valueChanges.subscribe(checked => {
      //   const controls = ['dienTichTS', 'ketCauXayDung', 'loaiNha'];
      //   controls.forEach(c => {
      //     const ctrl = tsGroup.get(`tsbdRequest.${c}`);
      //     checked ? ctrl?.enable() : ctrl?.disable();
      //   });
      // });
    });
  }




  private updateReason(): void {
    const loai = this.formGroup.get('pavvRequest.loaiPhuongAn')?.value;
    const rawValue = this.formGroup.get('tienSo')?.value;
    const tienChu = this.tienChu;
    // const mucDich = this.formGroup.get('muchDichVay')?.value;

    let prefix = '';
    if (loai === 'chanNuoi') {
      prefix = '- Lý do thực hiện phương án: Gia đình tôi có nhu cầu đầu tư mở rộng quy mô chăn nuôi nên cần một lượng vốn, vốn tự có của gia đình chưa đủ đáp ứng vốn chăn nuôi';
    } else if (loai === 'khac') {
      prefix = '- Lý do thực hiện phương án: Gia đình tôi có nhu cầu mở rộng sản xuất kinh doanh nên cần một lượng vốn lưu động, vốn tự có của gia đình chưa đáp ứng đủ vốn kinh doanh';
    }

    // if (mucDich) {
    //   prefix += `, với mục đích vay: ${mucDich}`;
    // }

    const suffix = rawValue
      ? `. Vì vậy gia đình chúng tôi lập phương án đề nghị QTD Thái Học cho chúng tôi vay số tiền là: ${rawValue} đồng (Bằng chữ: ${tienChu}).`
      : '.';

    (this.formGroup.get('pavvRequest') as FormGroup).get('reason')?.setValue(prefix + suffix, {emitEvent: false});
  }
  initHanMucTable(hanMucTable: FormArray) {
    const defaultRows = [
      {
        col1: '1',
        col2: 'Mua đầu vào (phải trả cho người bán hàng)',
        col3: 'Thanh toán tiền \n(trả cho người bán)\n',
        col4: '1',
        col5: '- Áp dụng hình thức trả ngay khi mua hàng để hưởng giá đầu vào thấp, nên thời gian thanh toán cho người bán bình quân là 1 ngày.'
      },
      {
        col1: '2',
        col2: 'Tồn kho',
        col3: 'Thời gian lưu kho',
        col4: '255',
        col5: '- Dự kiến nhập hàng số lượng lớn để giảm giá đầu vào và đa dạng hóa chủng loại để đáp ứng được nhu cầu của khách hàng mua nên dự kiến hàng tồn kho tăng.'
      },
      {
        col1: '3',
        col2: 'Tiêu thụ (phải thu khách hàng)',
        col3: 'Chính sách trả chậm',
        col4: '48',
        col5: '- Thỏa thuận và đảm bảo cạnh tranh, dự kiến tăng thời hạn trả chậm cho các khách hàng mua hàng thường xuyên và số lượng lớn nên thời gian dự kiến tăng.'
      },
      // Hai hàng cuối chỉ cần 3 cột
      { col1: "Số ngày bình quân:", col4: "304", col5: "" },
      { col1: "Vòng quay vốn lưu động", col4: "1.2", col5: "" }
    ];

    defaultRows.forEach((row, index) => {
      if (index < 3) {
        // Hàng bình thường: đủ 5 cột
        hanMucTable.push(this.fb.group({
          col1: [row.col1],
          col2: [row.col2],
          col3: [row.col3],
          col4: [row.col4],
          col5: [row.col5],
        }));
      } else {
        // Hai hàng cuối: chỉ 3 cột
        hanMucTable.push(this.fb.group({
          col1: [row.col1],
          col4: [row.col4],
          col5: [row.col5],
        }));
      }
    });
  }

  private syncField(sourceField: string, targetField: string): void {
    const sourceCtrl = this.formGroup.get(sourceField);
    if (sourceCtrl) {
      sourceCtrl.valueChanges.subscribe(value => {
        const taiSanArray = this.formGroup.get('taiSanArray') as FormArray;
        taiSanArray.controls.forEach((tsGroup: AbstractControl) => {
          (tsGroup as FormGroup).get(targetField)?.setValue(value, { emitEvent: false });
        });
      });
    }
  }

  // 👉 Preview file
  onSubmit(): void {
    const rawDate: Date = this.formGroup.get('contractDate')?.value;
    console.log('rawDate -->', rawDate);

    const formattedDate = rawDate
      ? new Date(rawDate.getTime() - rawDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;
    console.log('formattedDate -->', formattedDate);
// Trong onSubmit hoặc patch dữ liệu
    const assets = this.taiSanArray.controls.map((control: AbstractControl) => {
      const tsGroup = control as FormGroup; // đây chính là tsGroup
      const tcDateRaw = tsGroup.get('ngayTheChap')?.value;

      let formattedDateTC: string | null = null;
      if (tcDateRaw instanceof Date) {
        formattedDateTC = new Date(tcDateRaw.getTime() - tcDateRaw.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
      } else if (typeof tcDateRaw === 'string') {
        formattedDateTC = tcDateRaw.split('T')[0];
      }

      return {
        ...tsGroup.value,
        ngayTheChap: formattedDateTC,
        table1: this.buildTableRequest(tsGroup.get('table1') as FormArray),
        table2: this.buildTableRequest(tsGroup.get('table2') as FormArray),
        table3: this.buildTableRequest(tsGroup.get('table3') as FormArray),
        tsbdRequest: this.normalizeTsbdRequest(
          (tsGroup.get('tsbdRequest') as FormGroup)?.getRawValue()
        )
      };
    });


    const headers: string[] = this.tableHeaders.value;
    const rows: string[][] = this.tableRows.value.map((r: any) => [r.col1, r.col2, r.col3]);

    const tableRequest = {
      headers,
      rows,
      drawTable: this.formGroup.get('hasTable')?.value
    };
    this.syncTongVonToPavvRequest();
    this.syncTongVonLuuDong();
    const payload: CreditContract = {
      ...this.formGroup.value,
      contractDate: formattedDate,
      taiSanArray: assets,
      // ngayBaoDam: formattedDateBD,
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest,
      // table1: this.buildTableRequest(this.table1),
      // table2: this.buildTableRequest(this.table2),
      // table3: this.buildTableRequest(this.table3),
      hanMucTable: this.buildHanMucTableRequest(this.hanMucTable),
      chiPhiTable: this.buildChiPhiTableRequest(this.chiPhiTable),
      thuNhapDuKienTable: this.buildThuNhapTableRequest(this.thuNhapTable),
      phuLucHanMucTable: this.buildPhuLucHanMucTableRequest(this.phuLucHanMucTable),
      giaTriQuyenSuDungDat: this.giaTriQuyenSuDungDat,
    };
    this.creditContractService.previewContract(payload).subscribe(urls => {
      this.fileUrls = urls;
    });
  }
  onExport(): void {
    const rawDateStr: string = this.formGroup.get('contractDate')?.value;
    const rawDate = rawDateStr ? new Date(rawDateStr) : null;

    const formattedDate = rawDate
      ? new Date(rawDate.getTime() - rawDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;

    // Lấy danh sách tài sản
    const assets = (this.formGroup.get('taiSanArray') as FormArray).controls.map((control: AbstractControl) => {
      const tsGroup = control as FormGroup;
      const tcDateRaw = tsGroup.get('ngayTheChap')?.value;

      let formattedDateTC: string | null = null;
      if (tcDateRaw instanceof Date) {
        formattedDateTC = new Date(tcDateRaw.getTime() - tcDateRaw.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
      } else if (typeof tcDateRaw === 'string') {
        formattedDateTC = tcDateRaw.split('T')[0];
      }

      return {
        ...tsGroup.value,
        ngayTheChap: formattedDateTC,
        table1: this.buildTableRequest(tsGroup.get('table1') as FormArray),
        table2: this.buildTableRequest(tsGroup.get('table2') as FormArray),
        table3: this.buildTableRequest(tsGroup.get('table3') as FormArray),
        tsbdRequest: this.normalizeTsbdRequest(
          (tsGroup.get('tsbdRequest') as FormGroup)?.getRawValue()
        )
      };
    });

    const gnDateStr: string = this.formGroup.get('pavvRequest.ngayGiaiNgan')?.value;
    const gnDate = gnDateStr ? new Date(gnDateStr) : null;
    const formattedDateGN = gnDate
      ? new Date(gnDate.getTime() - gnDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;

    const headers: string[] = Array.isArray(this.tableHeaders.value) ? this.tableHeaders.value : [];
    const rows: string[][] = Array.isArray(this.tableRows.value)
      ? this.tableRows.value.map((r: any) => [r.col1, r.col2, r.col3])
      : [];
    const tableRequest = {
      headers,
      rows,
      drawTable: this.formGroup.get('hasTable')?.value
    };

    this.syncTongVonToPavvRequest();
    this.syncTongVonLuuDong();

    const payload: CreditContract = {
      ...this.formGroup.value,
      contractDate: formattedDate,
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest,
      hanMucTable: this.buildHanMucTableRequest(this.hanMucTable),
      chiPhiTable: this.buildChiPhiTableRequest(this.chiPhiTable),
      thuNhapDuKienTable: this.buildThuNhapTableRequest(this.thuNhapTable),
      phuLucHanMucTable: this.buildPhuLucHanMucTableRequest(this.phuLucHanMucTable),
      // giaTriQuyenSuDungDat: this.giaTriQuyenSuDungDat,
      pavvRequest: {
        ...this.formGroup.get('pavvRequest')?.value,
        ngayGiaiNgan: formattedDateGN
      },
      taiSanArray: assets   // ✅ thêm toàn bộ danh sách tài sản
    };

    console.log('payload -->', payload);
    if (this.mode === 'update' && this.contractId) {
      this.creditContractService.exportContractUpdate(this.contractId, payload).subscribe(blob => {
        this.downloadZip(blob);
      });
    } else {
      this.creditContractService.exportContract(payload).subscribe(blob => {
        this.downloadZip(blob);
      });
    }
  }


  // 👉 Tải file ZIP
  downloadZip(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contracts.zip';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // 👉 Upload avatar
  onFilesSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);

    // Hiển thị preview ngay
    this.fileAvatarUrls = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileAvatarUrls.push({
          fileName: file.name,
          contentType: file.type,
          fileUrl: e.target.result // base64 preview
        });
      };
      reader.readAsDataURL(file);
    });

    // Upload lên server
    this.uploadService.uploadFiles(files).subscribe({
      next: (res) => {
        // Cập nhật lại với URL thực tế từ server
        this.fileAvatarUrls = res.map((f: any) => ({
          ...f,
          fileUrl: f.fileUrl || `/uploads/${f.fileName}` // fallback nếu server chưa trả fileUrl
        }));
      },
      error: (err) => console.error('Upload thất bại:', err)
    });
  }


  // 👉 Hiển thị file preview bằng Google Viewer
  getGoogleViewerUrl(fileUrl: string): SafeResourceUrl {
    const googleUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent(fileUrl) + '&embedded=true';
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleUrl);
  }

  convertToWords(): void {
    const rawValue = this.formGroup.get('tienSo')?.value;
    if (rawValue) {
      const num = Number(String(rawValue).replace(/\./g, ''));
      this.tienChu = !isNaN(num) ? this.convertMoney.numberToVietnameseWordsMoney(num) : '';
    } else {
      this.tienChu = '';
    }
    this.updateReason(); // gọi hàm chung để cập nhật reason
  }

  // tiện getter
  get tableHeaders() {
    return this.formGroup.get('tableHeaders') as FormArray;
  }

  get tableRows() {
    return this.formGroup.get('tableRows') as FormArray;
  }

  addRow() {
    const loaiVay = this.formGroup.get('loaiVay')?.value;
    const contractDate: Date = this.formGroup.get('contractDate')?.value;

    if (loaiVay === 'trung_han') {
      // Xác định số lần hiện tại đã có
      const currentCount = this.tableRows.length;
      const nextCount = currentCount + 1;

      this.tableRows.push(this.fb.group({
        col1: [`Lần ${nextCount}`],
        col2: [this.formatDate(this.addYears(contractDate, nextCount))],
        col3: [''] // để người dùng nhập
      }));
    } else if (loaiVay === 'ngan_han') {
      // Ngắn hạn: chỉ có 1 dòng, nếu chưa có thì thêm
      if (this.tableRows.length === 0) {
        const tienSo: string = this.formGroup.get('tienSo')?.value;
        console.log('tienSo -->', tienSo)
        this.tableRows.push(this.fb.group({
          col1: ['1 Lần'],
          col2: [this.formatDate(this.addYears(contractDate, 1))],
          col3: [tienSo ? tienSo + ' đồng' : '']
        }));
      }
    } else {
      // Trường hợp khác: thêm dòng trống
      this.tableRows.push(this.fb.group({
        col1: [''],
        col2: [''],
        col3: ['']
      }));
    }
  }
// Hàm cộng thêm số năm
  private addYears(date: Date, years: number): Date {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

// Hàm format ngày dd/MM/yyyy
  private formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  removeRow(i: number) {
    this.tableRows.removeAt(i);
  }

  openExportDialog(): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {
        message: 'Bạn có chắc chắn muốn Export hợp đồng này?',
        color: 'red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onExport(); // chỉ export khi người dùng xác nhận
      }
    });
  }

  // calculateTongTaiSanBD() {
  //   console.log('== calculateTongTaiSanBD ==');
  //
  //   const landItems = this.formGroup.get('landItems')?.value;
  //   if (!landItems) return;
  //
  //   // Regex bắt các giá trị định giá
  //   const regex = /định giá là:\s*([\d\.]+)\s*đồng/g;
  //   let total = 0;
  //
  //   const matches = landItems.matchAll(regex);
  //   for (const match of matches) {
  //     const value = Number(match[1].replace(/\./g, ''));
  //     if (!isNaN(value)) {
  //       total += value;
  //     }
  //   }
  //
  //   // Format số và chuyển sang chữ
  //   const tongTaiSanBD = new Intl.NumberFormat('vi-VN').format(total);
  //   const tongTaiSanBDChu = this.convertMoney.numberToVietnameseWordsMoney(total);
  //
  //   // ✅ cập nhật trực tiếp vào form controls
  //   this.formGroup.patchValue({ tongTaiSanBD, tongTaiSanBDChu });
  //
  //   // ✅ cập nhật col7 của dòng đầu tiên table2 (nếu có)
  //   if (this.table2 && this.table2.length > 0) {
  //     const firstRow = this.table2.at(0) as FormGroup;
  //     if (firstRow?.get('col7')) {
  //       firstRow.get('col7')?.setValue(tongTaiSanBD, { emitEvent: false });
  //     }
  //   }
  // }

  private calculateTongTaiSanBD(tsGroup: FormGroup): void {
    const landItems = tsGroup.get('landItems')?.value;
    if (!landItems) return;

    const regex = /định giá là:\s*([\d\.]+)\s*đồng/g;
    let total = 0;

    const matches = landItems.matchAll(regex);
    for (const match of matches) {
      const value = Number(match[1].replace(/\./g, ''));
      if (!isNaN(value)) total += value;
    }

    const tongTaiSanBD = new Intl.NumberFormat('vi-VN').format(total);
    const tongTaiSanBDChu = this.convertMoney.numberToVietnameseWordsMoney(total);

    // cập nhật trực tiếp vào form controls của tài sản
    tsGroup.patchValue({ tongTaiSanBD, tongTaiSanBDChu }, { emitEvent: false });

    // ví dụ cập nhật col7 của dòng đầu tiên table2
    const table2 = tsGroup.get('table2') as FormArray;
    if (table2?.length > 0) {
      const firstRow = table2.at(0) as FormGroup;
      firstRow.get('col7')?.setValue(tongTaiSanBD, { emitEvent: false });
    }
  }


  createRow(defaultValues: any = {}): FormGroup {
    return this.fb.group({
      col1: [defaultValues.col1 || ''],
      col2: [defaultValues.col2 || ''],
      col3: [defaultValues.col3 || ''],
      col4: [defaultValues.col4 || 'x'],   // ✅ mặc định 'x'
      col5: [defaultValues.col5 || ''],
      col6: [defaultValues.col6 || 'm²'], // ✅ mặc định 'm²'
      col7: [defaultValues.col7 || ''],
      col8: [defaultValues.col8 || 'VNĐ']
    });
  }



  initTables() {
    // const table1 = this.table1;
    // if (table1.length === 0) {
    //   const row1T1 = this.createRow({
    //     col1: 'Giá đất ở của nhà nước quy định',
    //     col2: '6.000.000',   // ✅ mặc định row1 col2
    //     col3: 'đ/m²',
    //     col4: 'x',
    //     col5: '',
    //     col6: 'm²',
    //     col7: '',
    //     col8: 'VNĐ'
    //   });
    //   row1T1.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row1T1));
    //   row1T1.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row1T1));
    //   table1.push(row1T1);
    //
    //   const row2T1 = this.createRow({
    //     col1: 'Giá đất khác',
    //     col2: '140.000',   // ✅ mặc định row2 col2
    //     col3: 'đ/m²',
    //     col4: 'x',
    //     col5: '',
    //     col6: 'm²',
    //     col7: '',
    //     col8: 'VNĐ'
    //   });
    //   row2T1.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row2T1));
    //   row2T1.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row2T1));
    //   table1.push(row2T1);
    // }
    //
    // const table2 = this.table2;
    // if (table2.length === 0) {
    //   const row1T2 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
    //   row1T2.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row1T2));
    //   row1T2.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row1T2));
    //   table2.push(row1T2);
    //
    //   const row2T2 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
    //   row2T2.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row2T2));
    //   row2T2.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row2T2));
    //   table2.push(row2T2);
    // }
    //
    // const table3 = this.table3;
    // if (table3.length === 0) {
    //   const row1T3 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
    //   row1T3.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row1T3));
    //   row1T3.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row1T3));
    //   table3.push(row1T3);
    //
    //   const row2T3 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
    //   row2T3.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row2T3));
    //   row2T3.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row2T3));
    //   table3.push(row2T3);
    // }
    const chiPhiTable = this.chiPhiTable;
    if (chiPhiTable.length === 0) {
      const row1 = this.createChiPhiRow({
        stt: 'I',
        danhMuc: 'Chi phí trực tiếp',
        donVi: '',
        soLuong: '',
        donGia: '',
        thanhTien: '1000000',
        formula: 'SUM(rows[1..2].thanhTien)',
        mergeTargets: [],
        merge: null
      });
      chiPhiTable.push(row1);

      const row2 = this.createChiPhiRow({
        stt: '1',
        danhMuc: 'Giống gà',
        donVi: '',
        soLuong: '',
        donGia: '',
        thanhTien: '500000',
        formula: '',
        mergeTargets: [],
        merge: null
      });
      chiPhiTable.push(row2);

      const row3 = this.createChiPhiRow({
        stt: '2',
        danhMuc: 'Thức ăn',
        donVi: '',
        soLuong: '',
        donGia: '',
        thanhTien: '500000',
        formula: '',
        mergeTargets: [],
        merge: null
      });
      chiPhiTable.push(row3);
    }
  }

  createChiPhiRow(data: any = {}): FormGroup {
    const row = this.fb.group({
      stt: [data.stt || ''],
      danhMuc: [data.danhMuc || ''],
      donVi: [data.donVi || ''],
      soLuong: [data.soLuong || ''],
      donGia: [data.donGia || ''],
      thanhTien: [data.thanhTien || ''],
      isTotal: [data.isTotal || false],
      sumTargets: [data.sumTargets || []],
      merge: [data.merge || null],
      mergeTargets: [data.mergeTargets || []],   // thêm vào
      mergedValue: [data.mergedValue || '']
    });

    // Nếu không phải ô tổng thì tính Thành tiền = Số lượng × Đơn giá
    row.get('soLuong')?.valueChanges.subscribe(() => this.updateThanhTien(row));
    row.get('donGia')?.valueChanges.subscribe(() => this.updateThanhTien(row));

    return row;
  }

  // Thêm một hàng mới
  addChiPhiRow() {
    const row = this.fb.group({
      stt: [''],
      danhMuc: [''],
      donVi: [''],
      soLuong: [0],
      donGia: [0],
      thanhTien: [0],
      merge: [false],
      mergeTargets: [[]],
      mergedValue: [''],
      sum: [false],
      sumTargets: [[]]
    });
    this.chiPhiRows.push(row);
  }

// Xóa hàng
  removeChiPhiRow(index: number) {
    this.chiPhiRows.splice(index, 1);
  }


  formatNumber(value: number): string {
    return value.toLocaleString('vi-VN'); // ví dụ: 10000 -> "10.000"
  }


  updateThanhTien(row: FormGroup) {
    const soLuong = this.parseNumber(row.get('soLuong')?.value);
    const donGia = this.parseNumber(row.get('donGia')?.value);
    const thanhTien = soLuong * donGia;
    row.get('thanhTien')?.setValue(thanhTien.toLocaleString('vi-VN'), {emitEvent: false});
  }


  // get table1(): FormArray<FormGroup> {
  //   return this.formGroup.get('table1') as FormArray<FormGroup>;
  // }
  //
  //
  // get table2(): FormArray<FormGroup> {
  //   return this.formGroup.get('table2') as FormArray<FormGroup>;
  // }
  //
  // get table3(): FormArray<FormGroup> {
  //   return this.formGroup.get('table3') as FormArray<FormGroup>;
  // }
  table1(ts: AbstractControl): FormGroup[] {
    return ((ts as FormGroup).get('table1') as FormArray).controls as FormGroup[];
  }
  table2(ts: AbstractControl): FormGroup[] {
    return ((ts as FormGroup).get('table2') as FormArray).controls as FormGroup[];
  }
  table3(ts: AbstractControl): FormGroup[] {
    return ((ts as FormGroup).get('table3') as FormArray).controls as FormGroup[];
  }

  get hanMucTable(): FormArray {
    return this.formGroup.get('hanMucTable') as FormArray;
  }

  get chiPhiTable(): FormArray {
    return this.formGroup.get('chiPhiTable') as FormArray;
  }


  buildTableRequest(table: FormArray): any {
    const rows: string[][] = table.controls.map((row: any) => {
      return [
        row.get('col1')?.value || '',
        row.get('col2')?.value || '',
        row.get('col3')?.value || '',
        row.get('col4')?.value || '',
        row.get('col5')?.value || '',
        row.get('col6')?.value || '',
        row.get('col7')?.value || '',
        row.get('col8')?.value || ''
      ];
    });

    // Tính tổng col7 của 2 dòng đầu tiên
    const giaTriQuyenSuDungDat =
      Number(String(table.at(0).get('col7')?.value || '0').replace(/\./g, '')) +
      Number(String(table.at(1).get('col7')?.value || '0').replace(/\./g, ''));
    return {
      rows,
      giaTriQuyenSuDungDat // thêm biến này vào payload gửi backend
    };
  }

  buildHanMucTableRequest(table: FormArray): TableRequest {
    const rows: string[][] = table.controls.map((row: any) => {
      return [
        row.get('col1')?.value || '',
        row.get('col2')?.value || '',
        row.get('col3')?.value || '',
        row.get('col4')?.value || '',
        row.get('col5')?.value || '',
      ];
    });

    // Cấu hình merge cho 2 hàng cuối
    const merges = [
      {
        rowIndex: 3, // hàng thứ 4 (index bắt đầu từ 0)
        mergeTargets: ["0", "1", "2"], // gộp 3 cột đầu
        mergedValue: "Số ngày bình quân:"
      },
      {
        rowIndex: 4, // hàng thứ 5
        mergeTargets: ["0", "1", "2"],
        mergedValue: "Vòng quay vốn lưu động"
      }
    ];

    return {
      drawTable: true,
      headers: [
        'STT',
        'Giai đoạn',
        'Chi tiết',
        'Thời gian bình quân (ngày)',
        'Ghi chú'
      ],
      rows,
      merges,
      tableType: 'hanMuc'
    };
  }

  // TÍNH TỔNG CÁC HÀNG
  toggleSum(index: number, event: any) {
    const row = this.chiPhiTable.at(index) as FormGroup;
    const checked = event.target.checked;
    row.get('sum')?.setValue(checked);

    if (!checked) {
      row.get('sumTargets')?.setValue([]);
      row.get('thanhTien')?.setValue(0);
    }
  }
  onSumRowChange(row: FormGroup, targetIndex: number, event: any) {
    let sumTargets: number[] = row.get('sumTargets')?.value || [];

    if (event.target.checked) {
      sumTargets.push(targetIndex);
    } else {
      sumTargets = sumTargets.filter((idx: number) => idx !== targetIndex);
    }

    row.get('sumTargets')?.setValue(sumTargets);

    // Tính lại tổng thành tiền
    let total = 0;
    sumTargets.forEach((idx: number) => {
      const otherRow = this.chiPhiTable.at(idx) as FormGroup;
      let rawValue = otherRow.get('thanhTien')?.value || 0;

      if (typeof rawValue === 'string') {
        rawValue = rawValue.replace(/[^\d]/g, '');
      }

      const thanhTien = isNaN(Number(rawValue)) ? 0 : Number(rawValue);
      total += thanhTien;
    });

    // Format lại giống hàm formatOnBlur
    row.patchValue({ thanhTien: total.toLocaleString('vi-VN') });
  }

  buildChiPhiTableRequest(table: FormArray): TableRequest {
    const rows: string[][] = table.controls.map(ctrl => {
      const row = ctrl as FormGroup;
      return [
        row.get('stt')?.value || '',
        row.get('danhMuc')?.value || '',
        row.get('donVi')?.value || '',
        row.get('soLuong')?.value || '',
        row.get('donGia')?.value || '',
        row.get('thanhTien')?.value || ''
      ];
    });

    const merges: MergeInfo[] = table.controls.map((ctrl, idx) => {
      const row = ctrl as FormGroup;
      return {
        rowIndex: idx,
        mergeTargets: row.get('mergeTargets')?.value || [],
        mergedValue: row.get('mergedValue')?.value || ''
      };
    }).filter(m => m.mergeTargets.length > 0);

    return {
      drawTable: true,
      headers: ['STT', 'Danh mục', 'Đơn vị', 'Số lượng', 'Đơn giá (đồng)', 'Thành tiền (đồng)'],
      rows,
      merges,
      tableType: 'chiPhi'
    };
  }
// Chọn cột để merge
  onMergeTargetChange(row: FormGroup, option: string, event: any) {
    const checked = event.target.checked;
    let targets = row.get('mergeTargets')?.value || [];

    if (checked) {
      if (!targets.includes(option)) targets.push(option);
    } else {
      targets = targets.filter((t: string) => t !== option);
    }

    row.patchValue({ mergeTargets: targets });
  }

  giaTriQuyenSuDungDat(ts: FormGroup): number {
    const table = ts.get('table3') as FormArray;
    if (!table || table.length < 2) {
      return 0;
    }

    const raw1 = table.at(0).get('col7')?.value || '0';
    const raw2 = table.at(1).get('col7')?.value || '0';

    const row1 = Number(String(raw1).replace(/\./g, ''));
    const row2 = Number(String(raw2).replace(/\./g, ''));

    return row1 + row2;
  }



  get chiPhiRows(): FormGroup[] {
    return this.chiPhiTable.controls as FormGroup[];
  }

  onInputChange(event: any, row: AbstractControl, field: string) {
    const rowGroup = row as FormGroup;
    const raw = event.target.value.replace(/\./g, '');
    const value = Number(raw) || 0;

    rowGroup.get(field)?.setValue(value);

    if (field === 'col2') {
      event.target.value = value.toLocaleString('vi-VN');
    }

    const soLuong = Number(rowGroup.get('soLuong')?.value || 0);
    const donGia = Number(rowGroup.get('donGia')?.value || 0);
    const thanhTien = soLuong * donGia;
    rowGroup.get('thanhTien')?.setValue(thanhTien);

    const changedIndex = this.chiPhiRows.indexOf(rowGroup);
    this.updateParentRows(changedIndex);
  }

  formatOnBlur(row: AbstractControl, field: string) {
    const rowGroup = row as FormGroup;
    let rawValue = rowGroup.get(field)?.value?.toString().replace(/[^\d]/g, '') || '0';
    let value = Number(rawValue);

    if (field === 'col2') {
      rowGroup.patchValue({ [field]: value.toLocaleString('vi-VN') });
    }

    if (field === 'soLuong' || field === 'donGia') {
      rowGroup.patchValue({ [field]: value.toLocaleString('vi-VN') });
      const soLuong = Number((rowGroup.get('soLuong')?.value || '0').toString().replace(/[^\d]/g, ''));
      const donGia = Number((rowGroup.get('donGia')?.value || '0').toString().replace(/[^\d]/g, ''));
      const thanhTien = soLuong * donGia;
      rowGroup.patchValue({ thanhTien: thanhTien.toLocaleString('vi-VN') });
    } else if (field === 'thanhTien') {
      rowGroup.patchValue({ [field]: value.toLocaleString('vi-VN') });
    }
  }

  private updateParentRows(changedIndex: number) {
    this.chiPhiRows.forEach((parentRow: FormGroup, parentIndex: number) => {
      if (parentRow.get('sum')?.value) {
        const sumTargets: number[] = parentRow.get('sumTargets')?.value || [];
        if (sumTargets.includes(changedIndex)) {
          // Tính lại tổng từ các hàng con
          let total = 0;
          sumTargets.forEach(idx => {
            const childRow = this.chiPhiRows[idx] as FormGroup;
            total += Number(childRow.get('thanhTien')?.value || 0);
          });
          parentRow.get('thanhTien')?.setValue(total);
        }
      }
    });
  }


  insertM2(textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = textarea.value;

    // Chèn ký tự m² vào đúng vị trí con trỏ
    const newValue = current.substring(0, start) + 'm²' + current.substring(end);

    // Cập nhật lại textarea và FormControl
    textarea.value = newValue;
    this.formGroup.get('landItems')?.setValue(newValue);
  }
  isRowAvailableForSum(currentIndex: number, targetIndex: number): boolean {
    if (currentIndex === targetIndex) return false;

    const targetRow = this.chiPhiTable.at(targetIndex) as FormGroup;

    // Nếu hàng target đã nằm trong sumTargets của bất kỳ hàng khác thì ẩn đi (hàng con)
    for (let i = 0; i < this.chiPhiTable.length; i++) {
      if (i === currentIndex) continue;
      const otherRow = this.chiPhiTable.at(i) as FormGroup;
      const sumTargets = otherRow.get('sumTargets')?.value || [];
      if (sumTargets.includes(targetIndex)) {
        return false; // hàng con bị ẩn
      }
    }

    // Hàng cha (sum = true) vẫn hiển thị
    return true;
  }

  formatCurrency(value: number | null | undefined): string {
    if (!value) return '0';
    return value.toLocaleString('vi-VN'); // 1000000 -> "1.000.000"
  }
  onTienSoInput(event: any, controlName: string): void {
    // Lấy giá trị thô từ input
    let rawValue = event.target.value.replace(/\D/g, ''); // bỏ ký tự không phải số
    let num = rawValue ? Number(rawValue) : 0;

    // Format lại số theo locale VN
    const formatted = this.formatCurrency(num);

    // Cập nhật vào đúng FormControl
    this.formGroup.get(controlName)?.setValue(formatted, { emitEvent: true });

    // Nếu cần thì tính ra số tiền bằng chữ
    this.convertToWords();
  }

  get thuNhapTable(): FormArray {
    return this.formGroup.get('thuNhapTable') as FormArray;
  }

  get thuNhapRows(): FormGroup[] {
    return this.thuNhapTable.controls as FormGroup[];
  }
  loadThuNhapTable(tableRequest: TableRequest | undefined, formArray: FormArray): void {
    formArray.clear(); // 👉 clear trước để tránh dư hàng

    if (!tableRequest || !tableRequest.rows || tableRequest.rows.length === 0) {
      // Nếu không có dữ liệu từ backend thì khởi tạo mặc định
      this.initThuNhapTable();
      return;
    }

    // Patch dữ liệu từ backend
    tableRequest.rows.forEach((row: string[]) => {
      const group = this.fb.group({
        noiDung: [row[0] || ''],
        donVi: [row[1] || ''],
        soLuong: [Number(row[2]) || 0],
        donGia: [Number(row[3]) || 0],
        thanhTien: [Number(row[4]) || 0]
      });
      formArray.push(group);
    });
  }
  buildThuNhapTableRequest(table: FormArray): TableRequest {
    const rows = table.controls.map(ctrl => {
      const row = ctrl as FormGroup;
      return [
        row.get('noiDung')?.value || '',
        row.get('donVi')?.value || '',
        row.get('soLuong')?.value || '',
        row.get('donGia')?.value || '',
        row.get('thanhTien')?.value || ''
      ];
    });

    // Tính tổng thành tiền
    let tong = 0;
    rows.forEach((r, idx) => {
      if (idx < rows.length - 1) {
        tong += parseInt(r[4].toString().replace(/\./g, '') || '0', 10);
      }
    });
    rows[rows.length - 1] = ['Tổng cộng:', '', '', '', tong.toString()];

    return {
      headers: ["Nội dung","Đơn vị","Số lượng","Đơn giá","Thành tiền"],
      rows,
      drawTable: true,
      tableType: 'thuNhapDuKien',
      merges: [
        {
          rowIndex: rows.length - 1, // hàng cuối
          mergeTargets: ["noiDung","donVi","soLuong","donGia"], // merge 4 cột đầu
          mergedValue: "Tổng cộng:"
        }
      ]
    };
  }


  initThuNhapTable() {
    const formArray = this.thuNhapTable;
    formArray.clear();

    // 2 hàng nhập dữ liệu (hàng 2 và hàng 3)
    for (let i = 0; i < 2; i++) {
      const group = this.fb.group({
        noiDung: [''],
        donVi: [''],
        soLuong: [0],
        donGia: [0],
        thanhTien: [0]
      });
      formArray.push(group);
    }

    // Hàng tổng cộng (readonly)
    const totalGroup = this.fb.group({
      noiDung: ['Tổng cộng:'],
      donVi: [''],
      soLuong: [0],
      donGia: [0],
      thanhTien: [0]
    });
    formArray.push(totalGroup);
  }
  get tongThuNhap(): number {
    return this.thuNhapRows
      .slice(0, this.thuNhapRows.length - 1) // bỏ hàng cuối
      .reduce((sum, row) => sum + (row.get('thanhTien')?.value || 0), 0);
  }

  addThuNhapRow(): void {
    const formArray = this.thuNhapTable;
    // Chèn trước hàng tổng cộng
    formArray.insert(formArray.length - 1, this.fb.group({
      noiDung: [''],
      donVi: [''],
      soLuong: [0],
      donGia: [0],
      thanhTien: [0]
    }));
  }

  removeThuNhapRow(index: number): void {
    const formArray = this.thuNhapTable;
    // Không cho xóa hàng tổng cộng
    if (index < formArray.length - 1) {
      formArray.removeAt(index);
    }
  }
// Bảng phụ lục hạn mức table
  buildPhuLucHanMucTableRequest(table: FormArray): TableRequest {
    const rows: string[][] = table.controls.map((row: any, index: number) => {
      return [
        (index + 1).toString(), // STT tự tăng
        row.get('ngayGiaiNgan')?.value || '',
        row.get('ngayDenHan')?.value || '',
        row.get('soDuGoc')?.value || ''
      ];
    });

    // Thêm một hàng tổng cộng cuối cùng
    rows.push(["Tổng cộng", "", "", this.tongSoDuPhuLuc.toString()]);

    // Merge 3 cột đầu của hàng cuối
    const merges = [
      {
        rowIndex: rows.length - 1, // hàng cuối
        mergeTargets: ["0", "1", "2"],
        mergedValue: "Tổng cộng"
      }
    ];

    return {
      drawTable: true,
      headers: ['STT', 'Ngày giải ngân', 'Ngày đến hạn', 'Số dư gốc hiện tại'],
      rows,
      merges,
      tableType: 'phuLucHanMuc'
    };
  }

  get phuLucHanMucTable(): FormArray {
    return this.formGroup.get('phuLucHanMucTable') as FormArray;
  }

  get phuLucHanMucRows(): FormGroup[] {
    return this.phuLucHanMucTable.controls.map(c => c as FormGroup);
  }



  loadPhuLucHanMucTableArray(tableData: { rows: string[][] } | undefined, table: FormArray) {
    table.clear();
    if (!tableData || !tableData.rows) return;

    tableData.rows.forEach((rowData, rowIndex) => {
      const row = this.fb.group({
        ngayGiaiNgan: [rowData[1] || ''],
        ngayDenHan: [rowData[2] || ''],
        soDuGoc: [rowData[3] || '']
      });

      // Tính lại tổng khi thay đổi số dư gốc
      row.get('soDuGoc')?.valueChanges.subscribe(() => this.calculateTongSoDuPhuLuc());
      table.push(row);
    });

    this.calculateTongSoDuPhuLuc();
  }
  tongSoDuPhuLuc: number = 0;
  calculateTongSoDuPhuLuc() {
    this.tongSoDuPhuLuc = this.phuLucHanMucTable.controls.reduce((sum, row) => {
      const group = row as FormGroup; // ép kiểu
      const val = Number(group.get('soDuGoc')?.value || 0);
      return sum + val;
    }, 0);
  }


  addPhuLucHanMucRow() {
    const row = this.fb.group({
      ngayGiaiNgan: [''],
      ngayDenHan: [''],
      soDuGoc: [0]
    });

    row.get('soDuGoc')?.valueChanges.subscribe(() => this.calculateTongSoDuPhuLuc());
    this.phuLucHanMucTable.push(row);
  }

  removePhuLucHanMucRow(index: number) {
    this.phuLucHanMucTable.removeAt(index);
    this.calculateTongSoDuPhuLuc();
  }

  initPhuLucHanMucTable() {
    this.phuLucHanMucTable.clear();

    // Thêm một row trống mặc định
    this.addPhuLucHanMucRow();

    // Tính tổng ngay từ đầu
    this.calculateTongSoDuPhuLuc();
  }

//THÊM NHIỀU TÀI SẢN
  get taiSanArray(): FormArray {
    return this.formGroup.get('taiSanArray') as FormArray;
  }
  private taoTaiSan(): FormGroup {
    const group = this.fb.group({
      // Thông tin hợp đồng thế chấp
      soHopDongTheChapQSDD: [''],
      ngayTheChap: [''],
      noiDungNgoaiBia: [''],
      serial: [''],
      noiCapSo: [''],
      ngayCapSo: [''],
      noiDungVaoSo: [''],

      // Thông tin thửa đất
      soThuaDat: [''],
      soBanDo: [''],
      diaChiThuaDat: ['phường Chu Văn An, Hải Phòng'],
      dienTichDatSo: [''],
      dienTichDatChu: [''],
      thoiHanSuDung: ['Lâu dài'],
      hinhThucSuDung: [''],

      // ✅ Chuyển lên phẳng, đúng theo CreditContractTSBD
      dienTichTS: [{value: '100', disabled: false}],
      loaiNha: [{value: 'Kiên cố', disabled: false}],
      ketCauXayDung: [{value: 'Bê tông', disabled: false}],

      // Nội dung khác
      loaiDat: [''],
      nguonGocSuDung: [''],
      ghiChu: [''],
      muchDichSuDung: [{value: '+ Đất ở tại đô thị: 100 m²; + Đất LNK: 200 m²;', disabled: true}],

      // Checkbox
      checkMucDich: [false],
      checkLoaiDat: [false],
      checkNguonGocSuDung: [false],
      checkGhiChu: [false],
      checkHopDongBaoLanh: [false],
      checkNguoiDungTenBiaDo2: [false],

      // ✅ UI-only, KHÔNG có trong CreditContractTSBD — loại khỏi payload lúc build assets
      checkTaiSanGanLienVoiDat: [true],

      checkCMNDDungTenBiaDo1: [false],
      checkNgayCapCCCDTruocDayDungTenBiaDo1: [false],
      checkDiaChiThuongTruDungTenBiaDo1: [false],
      checkChiMangTenNguoi1: [false],
      checkCMNDDungTenBiaDo2: [false],
      checkNgayCapCCCDTruocDayDungTenBiaDo2: [false],
      checkDiaChiThuongTruDungTenBiaDo2: [false],
      checkChiMangTenNguoi2: [false],
      checkNguoiMangTenBiaDo: [false],

      // Tiêu đề động
      titleNguoiBaoLanh1: ['Người đứng tên bìa đỏ 1'],
      titleNguoiBaoLanh2: ['Người đứng tên bìa đỏ 2'],

      // Người đứng tên bìa đỏ 1
      dungTenBiaDo1: [''],
      gioiTinhDungTenBiaDo1: [''],
      namSinhDungTenBiaDo1: [''],
      cccdDungTenBiaDo1: [''],
      ngayCapCCCDDungTenBiaDo1: [''],
      noiCapCCCDDungTenBiaDo1: [''],
      diaChiThuongTruDungTenBiaDo1: [''],
      phoneDungTenBiaDo1: [''],
      // ✅ chuyển từ tsbdRequest lên phẳng
      cmndDungTenBiaDo1: [{value: '', disabled: true}],
      ngayCapCCCDTruocDayDungTenBiaDo1: [{value: '', disabled: true}],

      // Người đứng tên bìa đỏ 2
      dungTenBiaDo2: [''],
      gioiTinhDungTenBiaDo2: [''],
      namSinhDungTenBiaDo2: [''],
      cccdDungTenBiaDo2: [''],
      ngayCapCCCDDungTenBiaDo2: [''],
      noiCapCCCDDungTenBiaDo2: [''],
      diaChiThuongTruDungTenBiaDo2: [''],
      checkDongSoHuu: [false],
      // ✅ chuyển từ tsbdRequest lên phẳng
      cmndDungTenBiaDo2: [{value: '', disabled: true}],
      ngayCapCCCDTruocDayDungTenBiaDo2: [{value: '', disabled: true}],

      nguoiMangTen: [''],

      // Định giá
      landItems: [''],
      tongTaiSanBD: [''],
      tongTaiSanBDChu: [''],

      // ❌ ĐÃ XÓA: tsbdRequest: this.fb.group({...})

      table1: this.fb.array([
        this.createRow({col1: 'Giá đất ở của nhà nước quy định', col2: '6.000.000', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'}),
        this.createRow({col1: 'Giá đất khác', col2: '140.000', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'}),
      ]),
      table2: this.fb.array([
        this.createRow({col1: 'Giá đất ở của nhà nước quy định', col2: '', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'}),
        this.createRow({col1: 'Giá đất khác', col2: '', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'})
      ]),
      table3: this.fb.array([
        this.createRow({col1: 'Giá đất ở của nhà nước quy định', col2: '', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'}),
        this.createRow({col1: 'Giá đất khác', col2: '', col3: 'đ/m²', col4: 'x', col5: '', col6: 'm²', col7: '', col8: 'VNĐ'})
      ])
    });

    // Đổi tiêu đề người bảo lãnh
    group.get('checkHopDongBaoLanh')?.valueChanges.subscribe(checked => {
      group.patchValue({
        titleNguoiBaoLanh1: checked ? 'Người bảo lãnh 1' : 'Người đứng tên bìa đỏ 1',
        titleNguoiBaoLanh2: checked ? 'Người bảo lãnh 2' : 'Người đứng tên bìa đỏ 2'
      }, {emitEvent: false});
    });

    // ✅ Toggle enable/disable 3 field gắn liền với đất
    group.get('checkTaiSanGanLienVoiDat')?.valueChanges.subscribe(checked => {
      const controls = ['dienTichTS', 'loaiNha', 'ketCauXayDung'];
      controls.forEach(c => {
        checked ? group.get(c)?.enable() : group.get(c)?.disable();
      });
    });

    const table1 = group.get('table1') as FormArray<FormGroup>;
    table1.controls.forEach((r: FormGroup) => {
      r.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(r));
      r.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(r));
      this.updateTable1Row(r);
    });

    const table2 = group.get('table2') as FormArray<FormGroup>;
    table2.controls.forEach((r: FormGroup) => {
      r.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(r));
      r.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(r));
      this.updateTable2Row(r);
    });

    const table3 = group.get('table3') as FormArray<FormGroup>;
    table3.controls.forEach((r: FormGroup) => {
      r.get('col5')?.valueChanges.subscribe(() => this.updateTable3Row(r));
      r.get('col7')?.valueChanges.subscribe(() => this.updateTable3Row(r));
      this.updateTable3Row(r);
    });

    return group;
  }


  private updateDiaChiThuaDat(value: string) {
    this.taiSanArray.controls.forEach((ts: AbstractControl) => {
      if (value === 'gd') {
        (ts as FormGroup).patchValue({
          diaChiThuaDat: 'Thái Học, Chí Linh, Hải Dương (nay là phường Chu Văn An, Hải Phòng)'
        });
      } else if (value === 'pgd') {
        (ts as FormGroup).patchValue({
          diaChiThuaDat: 'An Lạc, Chí Linh, Hải Dương (nay là phường Lê Đại Hành, Hải Phòng)'
        });
      } else {
        (ts as FormGroup).patchValue({
          diaChiThuaDat: ''
        });
      }
    });
  }
  // Hàm thêm tài sản mới
  themTaiSan(): void {
    const newAsset = this.taoTaiSan();
    this.taiSanArray.push(newAsset);
    // Đăng ký lắng nghe cho tài sản mới
    this.listenAssetChanges(newAsset);
    this.setupValueChangeListeners();
  }
  // Hàm xóa tài sản theo index
  xoaTaiSan(index: number): void {
    this.taiSanArray.removeAt(index);
  }
  private listenAssetChanges(tsGroup: FormGroup): void {
    tsGroup.get('dienTichDatSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        // cập nhật hình thức sử dụng
        const formatted = `+ Sử dụng riêng: ${rawValue} m²; + Sử dụng chung: 0 m²`;
        tsGroup.get('hinhThucSuDung')?.setValue(formatted, { emitEvent: false });

        // cập nhật diện tích bằng chữ
        const chu = this.convertMoney.numberToVietnamese(String(rawValue));
        tsGroup.get('dienTichDatChu')?.setValue(chu, { emitEvent: false });
      } else {
        tsGroup.get('hinhThucSuDung')?.setValue('', { emitEvent: false });
        tsGroup.get('dienTichDatChu')?.setValue('', { emitEvent: false });
      }
    });
    // Checkbox Mục đích sử dụng
    tsGroup.get('checkMucDich')?.valueChanges.subscribe(checked => {
      if (checked) {
        tsGroup.get('muchDichSuDung')?.enable();
      } else {
        tsGroup.get('muchDichSuDung')?.disable();
      }
    });

    // Checkbox Nguồn gốc sử dụng
    tsGroup.get('checkNguonGocSuDung')?.valueChanges.subscribe(checked => {
      if (checked) {
        tsGroup.get('nguonGocSuDung')?.enable();
      } else {
        tsGroup.get('nguonGocSuDung')?.disable();
      }
    });

    // Checkbox Ghi chú
    tsGroup.get('checkGhiChu')?.valueChanges.subscribe(checked => {
      if (checked) {
        tsGroup.get('ghiChu')?.enable();
      } else {
        tsGroup.get('ghiChu')?.disable();
      }
    });
    // Checkbox Loại đất
    tsGroup.get('checkLoaiDat')?.valueChanges.subscribe(checked => {
      if (checked) {
        tsGroup.get('loaiDat')?.enable();
      } else {
        tsGroup.get('loaiDat')?.disable();
      }
    });
  }
  onNguoiDaiDienChange(value: string) {
    if (value === 'gd') {
      // Logic cũ: patch địa chỉ
      this.formGroup.patchValue({
        diaChiThuongTruKhachHang: ', phường Chu Văn An, thành phố Hải Phòng',
        diaChiThuongTruNguoiThan: ', phường Chu Văn An, thành phố Hải Phòng',
        // noiCapSo: 'UBND huyện Chí Linh, tỉnh Hải Dương (Nay là phường Chu Văn An, Hải Phòng)'
      });


    } else if (value === 'pgd') {
      // Logic cũ: patch địa chỉ
      this.formGroup.patchValue({
        diaChiThuongTruKhachHang: ', phường Lê Đại Hành, thành phố Hải Phòng',
        diaChiThuongTruNguoiThan: ', phường Lê Đại Hành, thành phố Hải Phòng',
        // noiCapSo: 'UBND huyện Chí Linh, tỉnh Hải Dương (Nay là phường Lê Đại Hành, Hải Phòng)'
      });
    }

    // Giữ nguyên logic cũ
    this.updateDiaChiThuaDat(value);
  }


  private normalizeTsbdRequest(tsbdRequest: any): any {
    const raw = tsbdRequest || {};
    const isEmpty = (v: any) => v === null || v === undefined || v === '';

    const dienTichTS = isEmpty(raw.dienTichTS) ? 0 : raw.dienTichTS;
    const loaiNha = isEmpty(raw.loaiNha) ? 0 : raw.loaiNha;
    const ketCauXayDung = isEmpty(raw.ketCauXayDung) ? 0 : raw.ketCauXayDung;

    return {
      ...raw,
      dienTichTS,
      loaiNha,
      ketCauXayDung
    };
  }
}
