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
  titleNguoiBaoLanh1 = 'Người đứng tên bìa đỏ 1';
  titleNguoiBaoLanh2 = 'Người đứng tên bìa đỏ 2';
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
    console.log('this mode --->', this.mode);
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

        this.loadTableArray(contract.table1, this.table1, 8, 'table1');
        this.loadTableArray(contract.table2, this.table2, 8, 'table2');
        this.loadTableArray(contract.table3, this.table3, 8, 'table3');
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
        if (contract.ngayBaoDam) {
          this.formGroup.get('ngayBaoDam')?.setValue(new Date(contract.ngayBaoDam));
        }
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
  }

  /* ---------- Helper methods ---------- */

  private initForm(): void {
    this.formGroup = this.fb.group({
      contractDate: [new Date()],
      ngayTheChap: [new Date()],
      ngayBaoDam: [new Date()],
      soHopDongTD: ['01/25/232'],
      // vayLai: [false],
      nguoiDaiDien: ['PHÙNG THỊ LOAN - Chức vụ: Giám đốc điều hành'],
      tenKhachHang: [''],
      gtkh: [''],
      namSinhKhachHang: [''],
      phoneKhachHang: [''],
      soTheThanhVienKhachHang: [''],
      cccdKhachHang: [''],
      ngayCapCCCDKhachHang: [''],
      diaChiThuongTruKhachHang: [', phường Chu Văn An, thành phố Hải Phòng'],
      gtnt: [''],
      tongTaiSanBD: [''],
      tongTaiSanBDChu: [''],
      tenNguoiThan: [''],
      namSinhNguoiThan: [''],
      cccdNguoiThan: [''],
      ngayCapCCCDNguoiThan: [''],
      diaChiThuongTruNguoiThan: [', phường Chu Văn An, thành phố Hải Phòng'],
      quanHe: ['Là vợ'],
      tienSo: [''],
      muchDichVay: [''],
      soBBXetDuyetChoVay: [''],
      hanMuc: [''],
      laiSuat: ['9,5%/năm'],
      ngayKetThucKyHanVay: [''],
      soHopDongTheChapQSDD: ['07/26/006'],
      serial: [''],
      noiCapSo: [''],
      ngayCapSo: [''],
      noiDungVaoSo: ['Số vào sổ cấp Giấy chứng nhận: CN7078'],
      soThuaDat: [''],
      noiDungNgoaiBia: [''],
      soBanDo: [''],
      diaChiThuaDat: [', Chí Linh, Hải Dương (nay là phường Chu Văn An, thành phố Hải Phòng)'],
      dienTichDatSo: [''],
      thoiHanVay: [''],
      dienTichDatChu: [''],
      hinhThucSuDung: ['+ Sử dụng riêng: 690  m²; + Sử dụng chung: 0 m²'],
      muchDichSuDung: [{value: '- Mục đích sử dụng: + Đất ở tại đô thị: 50m²; + Đất LNK: 55,3m²', disabled: true}],
      thoiHanSuDung: ['Lâu dài'],
      soBienBanDinhGia: ['07/006/BBĐG'],
      noiDungThoaThuan: ['là một mảnh đất ở hợp pháp lâu dài với diện tích '],
      checkNguonGocSuDung: [false],
      noiCapCCCDNguoiThan: [''],
      noiCapCCCDKhachHang: [''],
      noiCapCCCDDungTenBiaDo1: [''],
      noiCapCCCDDungTenBiaDo2: [{value: '', disabled: true}],
      nguonGocSuDung: [{value: '', disabled: true}],
      checkGhiChu: [false],
      ghiChu: [{value: '', disabled: true}],
      loaiVay: [{value: '', disabled: true}],
      choVay: [{value: 'Cho vay:', disabled: true}],
      checkOption: [false],
      checkNhaCoDinh: [false],
      checkMucDich: [false],
      checkLoaiDat: [false],
      tsbdRequest: this.fb.group({
        checkTaiSanGanLienVoiDat: [false],
        dienTichTS: [{value: '', disabled: true}],
        ketCauXayDung: [{value: 'bê tông', disabled: true}],
        loaiNha: [{value: 'kiên cố', disabled: true}],

        // Người đứng tên bìa đỏ 1
        checkCMNDDungTenBiaDo1: [false],
        cmndDungTenBiaDo1: [{ value: 'CMND Số: 030083003225; Cấp ngày: 11/08/2021; Nơi cấp: Công an Hải Hưng', disabled: true }],
        checkNgayCapCCCDTruocDayDungTenBiaDo1: [false],
        ngayCapCCCDTruocDayDungTenBiaDo1: [{ value: '11/08/2021', disabled: true }],
        checkDiaChiThuongTruDungTenBiaDo1: [false],
        diaChiThuongTruDungTenBiaDo1: [{value: 'Địa chỉ thường trú: xã An Lạc, Chí Linh, Hải Dương', disabled: true}],

        // Người đứng tên bìa đỏ 2
        checkCMNDDungTenBiaDo2: [false],
        cmndDungTenBiaDo2: [{ value: 'CMND Số: 030083003225; Cấp ngày: 11/08/2021; Nơi cấp: Công an Hải Hưng', disabled: true }],
        checkNgayCapCCCDTruocDayDungTenBiaDo2: [false],
        ngayCapCCCDTruocDayDungTenBiaDo2: [{ value: '11/08/2021', disabled: true }],
        checkDiaChiThuongTruDungTenBiaDo2: [false],
        diaChiThuongTruDungTenBiaDo2: [{value: 'Địa chỉ thường trú: xã An Lạc, Chí Linh, Hải Dương', disabled: true}],
        checkChiMangTenNguoi1: [false],
        checkChiMangTenNguoi2: [false]
      }),
      pavvRequest: this.fb.group({
        name: [''],
        address: [{value: '', disabled: true}],
        checkAddress: [false],
        reason: [''],
        tongVon: [''],
        tongVonLuuDong: [''],
        vonTuCo: [''],
        vonKhac: [''],
        reLoanSequence: [{value: 0, disabled: false}],
        vayLai: [false],
        heSoVonTuCo: ['40'],
        nguoiChuyenKhoan: ['Chuyển khoản cho bà: .......................; CCCD Số: ....................; Cấp ngày: .................; Số điện thoại: .................; Số tài khoản: ......................; Tại ngân hàng............'],
        loaiPhuongAn: [''],
        duNoTruoc: [''],
        soTienVayLanNay: ['']
      }),
      loaiDat: [{value: '+ Đất ở tại đô thị: 50m²; + Đất trồng cây lâu năm 55,3m²', disabled: true}],
      nhaCoDinh: [{value: '- Nhà ở cố định:    m²;  loại nhà:      ; \nĐược định giá 0 đồng', disabled: true}],
      checkNguoiDungTenBiaDo2: [false],
      checkHopDongBaoLanh: [false],
      landItems: ['+ Đất ở: 120m²; được định giá là: 1.200.000.000 đồng\n+ Đất LNK: 300m²; được định giá là: 2.500.000.000 đồng\n+ Đất ao: 300m²; được định giá là: 2.500.000.000 đồng'],
      hasTable: [false],
      tableHeaders: this.fb.array([
        this.fb.control('Kế hoạch trả nợ'),
        this.fb.control('Ngày, tháng năm trả nợ'),
        this.fb.control('Số tiền phải trả')
      ]),
      tableRows: this.fb.array([]),
      dungTenBiaDo1: [''],
      gioiTinhDungTenBiaDo1: [''],
      namSinhDungTenBiaDo1: [''],
      phoneDungTenBiaDo1: [''],
      cccdDungTenBiaDo1: [''],
      ngayCapCCCDDungTenBiaDo1: [''],
      diaChiThuongTruDungTenBiaDo1: [''],
      dungTenBiaDo2: [{value: 'và bà ', disabled: true}],
      gioiTinhDungTenBiaDo2: [{value: '', disabled: true}],
      namSinhDungTenBiaDo2: [{value: '', disabled: true}],
      cccdDungTenBiaDo2: [{value: '', disabled: true}],
      ngayCapCCCDDungTenBiaDo2: [{value: '', disabled: true}],
      diaChiThuongTruDungTenBiaDo2: [{value: '', disabled: true}],
      checkNguoiMangTenBiaDo: [false],
      nguoiMangTen: [{value: 'mang tên ...', disabled: true}],

      table1: this.fb.array<FormGroup>([]),
      table2: this.fb.array<FormGroup>([]),
      table3: this.fb.array<FormGroup>([]),
      hanMucTable: this.fb.array([]),
      chiPhiTable: this.fb.array([]),
      thuNhapTable: this.fb.array([]),
      phuLucHanMucTable: this.fb.array([])
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
    this.syncField('tenKhachHang', 'dungTenBiaDo1');
    this.syncField('gtkh', 'gioiTinhDungTenBiaDo1');
    this.syncField('namSinhKhachHang', 'namSinhDungTenBiaDo1');
    this.syncField('phoneKhachHang', 'phoneDungTenBiaDo1');
    this.syncField('cccdKhachHang', 'cccdDungTenBiaDo1');
    this.syncField('ngayCapCCCDKhachHang', 'ngayCapCCCDDungTenBiaDo1');
    this.syncField('diaChiThuongTruKhachHang', 'diaChiThuongTruDungTenBiaDo1');
    this.syncField('noiCapCCCDKhachHang', 'noiCapCCCDDungTenBiaDo1');

    this.syncField('tenNguoiThan', 'dungTenBiaDo2');
    this.syncField('gtnt', 'gioiTinhDungTenBiaDo2');
    this.syncField('namSinhNguoiThan', 'namSinhDungTenBiaDo2');
    this.syncField('cccdNguoiThan', 'cccdDungTenBiaDo2');
    this.syncField('ngayCapCCCDNguoiThan', 'ngayCapCCCDDungTenBiaDo2');
    this.syncField('diaChiThuongTruNguoiThan', 'diaChiThuongTruDungTenBiaDo2');
    this.syncField('noiCapCCCDNguoiThan', 'noiCapCCCDDungTenBiaDo2');

    this.formGroup.get('dienTichDatSo')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = `+ Sử dụng riêng: ${value} m²; + Sử dụng chung: 0 m²`;
        this.formGroup.get('hinhThucSuDung')?.setValue(formatted);
      } else {
        this.formGroup.get('hinhThucSuDung')?.setValue('');
      }
    });
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
      noiCapCCCDNguoiThan: contract.noiCapCCCDKhachHang,
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
      muchDichVay: contract.muchDichVay,
      hanMuc: contract.hanMuc,
      laiSuat: contract.laiSuat,
      soHopDongTheChapQSDD: contract.soHopDongTheChapQSDD,
      serial: contract.serial,
      noiCapSo: contract.noiCapSo,
      ngayCapSo: contract.ngayCapSo,
      noiDungVaoSo: contract.noiDungVaoSo,
      soThuaDat: contract.soThuaDat,
      soBanDo: contract.soBanDo,
      diaChiThuaDat: contract.diaChiThuaDat,
      dienTichDatSo: contract.dienTichDatSo,
      dienTichDatChu: contract.dienTichDatChu,
      hinhThucSuDung: contract.hinhThucSuDung,
      thoiHanSuDung: contract.thoiHanSuDung,
      soBienBanDinhGia: contract.soBienBanDinhGia,
      noiDungThoaThuan: contract.noiDungThoaThuan,
      nguonGocSuDung: contract.nguonGocSuDung,
      ghiChu: contract.ghiChu,
      choVay: contract.choVay,
      loaiVay: contract.loaiVay,
      checkOption: contract.checkOption,
      checkGhiChu: contract.checkGhiChu,
      checkNguonGocSuDung: contract.checkNguonGocSuDung,
      checkNhaCoDinh: contract.checkNhaCoDinh,
      checkLoaiDat: contract.checkLoaiDat,
      checkMucDich: contract.checkMucDich,
      checkNguoiDungTenBiaDo2: contract.checkNguoiDungTenBiaDo2,
      checkHopDongBaoLanh: contract.checkHopDongBaoLanh,
      landItems: contract.landItems,
      hasTable: contract.tableRequest?.drawTable ?? false,
      tsbdRequest: {
        checkTaiSanGanLienVoiDat: contract.tsbdRequest?.checkTaiSanGanLienVoiDat ?? false,
        dienTichTS: contract.tsbdRequest?.dienTichTS ?? '',
        ketCauXayDung: contract.tsbdRequest?.ketCauXayDung ?? '',
        loaiNha: contract.tsbdRequest?.loaiNha ?? '',
        checkCMNDDungTenBiaDo1: contract.tsbdRequest?.checkCMNDDungTenBiaDo1 ?? false,
        cmndDungTenBiaDo1: contract.tsbdRequest?.cmndDungTenBiaDo1 ?? '',
        checkNgayCapCCCDTruocDayDungTenBiaDo1: contract.tsbdRequest?.checkNgayCapCCCDTruocDayDungTenBiaDo1 ?? false,
        ngayCapCCCDTruocDayDungTenBiaDo1: contract.tsbdRequest?.ngayCapCCCDTruocDayDungTenBiaDo1 ?? '',
        checkCMNDDungTenBiaDo2: contract.tsbdRequest?.checkCMNDDungTenBiaDo2 ?? false,
        cmndDungTenBiaDo2: contract.tsbdRequest?.cmndDungTenBiaDo2 ?? '',
        checkNgayCapCCCDTruocDayDungTenBiaDo2: contract.tsbdRequest?.checkNgayCapCCCDTruocDayDungTenBiaDo2 ?? false,
        ngayCapCCCDTruocDayDungTenBiaDo2: contract.tsbdRequest?.ngayCapCCCDTruocDayDungTenBiaDo2 ?? '',
        checkDiaChiThuongTruDungTenBiaDo1: contract.tsbdRequest?.checkDiaChiThuongTruDungTenBiaDo1 ?? false,
        diaChiThuongTruDungTenBiaDo1: contract.tsbdRequest?.diaChiThuongTruDungTenBiaDo1 ?? '',
        checkDiaChiThuongTruDungTenBiaDo2: contract.tsbdRequest?.checkDiaChiThuongTruDungTenBiaDo2 ?? false,
        diaChiThuongTruDungTenBiaDo2: contract.tsbdRequest?.diaChiThuongTruDungTenBiaDo2 ?? '',
        checkChiMangTenNguoi1: contract.tsbdRequest?.checkChiMangTenNguoi1 ?? '',
        checkChiMangTenNguoi2: contract.tsbdRequest?.checkChiMangTenNguoi2 ?? ''
      },
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
        reLoanSequence: contract.pavvRequest?.reLoanSequence ?? '',
        heSoVonTuCo: contract.pavvRequest?.heSoVonTuCo ?? '',
        nguoiChuyenKhoan: contract.pavvRequest?.nguoiChuyenKhoan ?? '',
        loaiPhuongAn: contract.pavvRequest?.loaiPhuongAn ?? '',
        duNoTruoc: contract.pavvRequest?.duNoTruoc ?? '',
        soTienVayLanNay: contract.pavvRequest?.soTienVayLanNay ?? '',
      }
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


//CẬP NHẬT THÔNG TIN TABLE1  XÁC ĐỊNH GIÁ TRỊ TSBĐ
// Hàm tính toán cho table1
  updateTable1Row(row: FormGroup) {
    console.log('== updateTable1 ==');
    const col2 = this.parseNumber(row.get('col2')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    // Nếu thiếu dữ liệu thì bỏ qua, không ghi đè col2
    if (!col2 || !col5) return;

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

  // private formatCurrencyss(val: any): string {
  //   const num = this.parseCurrency(val);
  //   return num.toLocaleString('vi-VN');
  // }

  updateTableFromLandItems(table: FormArray, updateRowFn: (row: FormGroup) => void) {
    const landItems = this.formGroup.get('landItems')?.value;
    if (!landItems) return;

    const regexArea = /:\s*([\d\.]+)\s*m²/g;
    const regexValue = /được định giá(?: là)?:\s*([\d\.]+)/g;

    let firstArea = 0, totalOtherArea = 0;
    let firstValue = 0, totalOtherValue = 0;

    const matchesArea = [...landItems.matchAll(regexArea)];
    const matchesValue = [...landItems.matchAll(regexValue)];

    matchesArea.forEach((match, index) => {
      const value = this.parseArea(match[1]); // giữ đúng số thập phân
      if (index === 0) firstArea = value;
      else totalOtherArea += value;
    });

    matchesValue.forEach((match, index) => {
      const value = this.parseCurrency(match[1]); // đúng số tiền lớn
      if (index === 0) firstValue = value;
      else totalOtherValue += value;
    });

    if (table.length > 0) {
      const firstRow = table.at(0) as FormGroup;
      firstRow?.get('col5')?.setValue(firstArea || 0, { emitEvent: false });
      firstRow?.get('col7')?.setValue(this.formatCurrency(firstValue || 0), { emitEvent: false });
      updateRowFn(firstRow);
    }

    if (table.length > 1) {
      const secondRow = table.at(1) as FormGroup;
      secondRow?.get('col5')?.setValue(totalOtherArea || 0, { emitEvent: false });
      secondRow?.get('col7')?.setValue(this.formatCurrency(totalOtherValue || 0), { emitEvent: false });
      updateRowFn(secondRow);
    }
  }



  updateTable2Row(row: FormGroup) {
    console.log('========== updateTable2Row ============== ');
    const col7 = this.parseNumber(row.get('col7')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    if (col5 > 0) {
      const result = Math.round(col7 / col5);
      console.log('result --------->', result);
      row.get('col2')?.setValue(result.toLocaleString('vi-VN'), { emitEvent: false });
    }
  }
  updateTable3Row(row: FormGroup) {
    console.log('========== updateTable3Row ============== ');
    const col7 = this.parseNumber(row.get('col7')?.value);
    const col5 = this.parseNumber(row.get('col5')?.value);

    if (col5 > 0) {
      const result = Math.round(col7 / col5);
      console.log('result (table3) --------->', result);
      row.get('col2')?.setValue(result.toLocaleString('vi-VN'), { emitEvent: false });
    }
  }


  private applyConditionalControls(contract: any): void {
    if (contract.checkOption) {
      this.formGroup.get('loaiVay')?.enable();
      this.formGroup.get('choVay')?.enable();
      this.formGroup.get('loaiVay')?.setValue(contract.loaiVay);
      this.formGroup.get('choVay')?.setValue(contract.choVay);
    } else {
      this.formGroup.get('loaiVay')?.disable();
      this.formGroup.get('choVay')?.disable();
    }
    if (contract.tsbdRequest?.checkTaiSanGanLienVoiDat) {
      this.formGroup.get('tsbdRequest.dienTichTS')?.enable();
      this.formGroup.get('tsbdRequest.ketCauXayDung')?.enable();
      this.formGroup.get('tsbdRequest.loaiNha')?.enable();

      this.formGroup.get('tsbdRequest.dienTichTS')?.setValue(contract.tsbdRequest.dienTichTS);
      this.formGroup.get('tsbdRequest.ketCauXayDung')?.setValue(contract.tsbdRequest.ketCauXayDung);
      this.formGroup.get('tsbdRequest.loaiNha')?.setValue(contract.tsbdRequest.loaiNha);
    } else {
      this.formGroup.get('tsbdRequest.dienTichTS')?.disable();
      this.formGroup.get('tsbdRequest.ketCauXayDung')?.disable();
      this.formGroup.get('tsbdRequest.loaiNha')?.disable();
    }
    if (contract.pavvRequest?.checkAddress) {
      this.formGroup.get('pavvRequest.address')?.enable();
      this.formGroup.get('pavvRequest.address')?.setValue(contract.pavvRequest.address);
    }


    if (contract.checkLoaiDat) {
      this.formGroup.get('loaiDat')?.enable();
      this.formGroup.get('loaiDat')?.setValue(contract.loaiDat);
    } else {
      this.formGroup.get('loaiDat')?.disable();
    }

    if (contract.checkMucDich) {
      this.formGroup.get('muchDichSuDung')?.enable();
      this.formGroup.get('muchDichSuDung')?.setValue(contract.muchDichSuDung);
    } else {
      this.formGroup.get('muchDichSuDung')?.disable();
    }

    if (contract.checkNguoiDungTenBiaDo2) {
      this.formGroup.get('dungTenBiaDo2')?.enable();
      this.formGroup.get('gioiTinhDungTenBiaDo2')?.enable();
      this.formGroup.get('namSinhDungTenBiaDo2')?.enable();
      this.formGroup.get('cccdDungTenBiaDo2')?.enable();
      this.formGroup.get('ngayCapCCCDDungTenBiaDo2')?.enable();
      this.formGroup.get('diaChiThuongTruDungTenBiaDo2')?.enable();
      this.formGroup.get('noiCapCCCDDungTenBiaDo2')?.enable();

      this.formGroup.get('dungTenBiaDo2')?.setValue(contract.dungTenBiaDo2);
      this.formGroup.get('gioiTinhDungTenBiaDo2')?.setValue(contract.gioiTinhDungTenBiaDo2);
      this.formGroup.get('namSinhDungTenBiaDo2')?.setValue(contract.namSinhDungTenBiaDo2);
      this.formGroup.get('cccdDungTenBiaDo2')?.setValue(contract.cccdDungTenBiaDo2);
      this.formGroup.get('ngayCapCCCDDungTenBiaDo2')?.setValue(contract.ngayCapCCCDDungTenBiaDo2);
      this.formGroup.get('noiCapCCCDDungTenBiaDo2')?.setValue(contract.noiCapCCCDDungTenBiaDo2);
      this.formGroup.get('diaChiThuongTruDungTenBiaDo2')?.setValue(contract.diaChiThuongTruDungTenBiaDo2);
    }

    if (contract.checkGhiChu) {
      this.formGroup.get('ghiChu')?.enable();
      this.formGroup.get('ghiChu')?.setValue(contract.ghiChu);
    }

    if (contract.checkNguoiMangTenBiaDo) {
      this.formGroup.get('nguoiMangTen')?.enable();
      this.formGroup.get('nguoiMangTen')?.setValue(contract.nguoiMangTen);
    }

    if (contract.checkNhaCoDinh) {
      this.formGroup.get('nhaCoDinh')?.enable();
      this.formGroup.get('nhaCoDinh')?.setValue(contract.nhaCoDinh);
    }

    if (contract.checkNguonGocSuDung) {
      this.formGroup.get('nguonGocSuDung')?.enable();
      this.formGroup.get('nguonGocSuDung')?.setValue(contract.nguonGocSuDung);
    }
  }

  private setupValueChangeListeners(): void {
    this.formGroup.get('muchDichVay')?.valueChanges.subscribe(value => {
      console.log('value much dich vay -->', value);
      this.formGroup.get('pavvRequest.name')?.setValue(value, {emitEvent: false});
    });
    this.formGroup.get('tsbdRequest.checkCMNDDungTenBiaDo1')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.cmndDungTenBiaDo1');
      checked ? control?.enable() : control?.disable();
    });
    this.formGroup.get('tsbdRequest.checkNgayCapCCCDTruocDayDungTenBiaDo1')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.ngayCapCCCDTruocDayDungTenBiaDo1');
      checked ? control?.enable() : control?.disable();
    });
    this.formGroup.get('tsbdRequest.checkCMNDDungTenBiaDo2')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.cmndDungTenBiaDo2');
      checked ? control?.enable() : control?.disable();
    });
    this.formGroup.get('tsbdRequest.checkNgayCapCCCDTruocDayDungTenBiaDo2')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.ngayCapCCCDTruocDayDungTenBiaDo2');
      checked ? control?.enable() : control?.disable();
    });
    this.formGroup.get('tsbdRequest.checkDiaChiThuongTruDungTenBiaDo1')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.diaChiThuongTruDungTenBiaDo1');
      checked ? control?.enable() : control?.disable();
    });
    this.formGroup.get('tsbdRequest.checkDiaChiThuongTruDungTenBiaDo2')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('tsbdRequest.diaChiThuongTruDungTenBiaDo2');
      checked ? control?.enable() : control?.disable();
    });



    this.formGroup.get('diaChiThuongTruKhachHang')?.valueChanges.subscribe(value => {
      console.log('value much dich vay -->', value);
      this.formGroup.get('pavvRequest.address')?.setValue(value, {emitEvent: false});
    });

    // this.formGroup.get('tienSo')?.valueChanges.subscribe(rawValue => {
    //   if (rawValue) {
    //     const num = Number(String(rawValue).replace(/\./g, ''));
    //     this.tienChu = !isNaN(num) ? this.convertMoney.numberToVietnameseWordsMoney(num) : '';
    //   } else {
    //     this.tienChu = '';
    //   }
    //
    //   // Sau khi tính được số tiền bằng chữ, cập nhật vào lý do
    //   const reasonText = `- Lý do thực hiện phương án: Gia đình tôi có nhu cầu mở rộng sản xuất kinh doanh nên cần một lượng vốn lưu động, vốn tự có của gia đình chưa đáp ứng đủ vốn kinh doanh. Vì vậy gia đình chúng tôi lập phương án đề nghị QTD Thái Học cho chúng tôi vay số tiền là:  ${rawValue} đồng (Bằng chữ: ${this.tienChu})`;
    //   (this.formGroup.get('pavvRequest') as FormGroup).get('reason')?.setValue(reasonText, {emitEvent: false});
    // });


    this.formGroup.get('landItems')?.valueChanges.subscribe(() => {
      this.calculateTongTaiSanBD();
      this.updateTableFromLandItems(this.table1, this.updateTable1Row.bind(this));
      this.updateTableFromLandItems(this.table2, this.updateTable2Row.bind(this));
      this.updateTableFromLandItems(this.table3, this.updateTable3Row.bind(this));
    });
    this.updateTableFromLandItems(this.table2, this.updateTable2Row.bind(this));



    this.formGroup.get('dienTichDatSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        const chu = this.convertMoney.numberToVietnamese(String(rawValue));
        this.formGroup.get('dienTichDatChu')?.setValue(chu, {emitEvent: false});
      } else {
        this.formGroup.get('dienTichDatChu')?.setValue('', {emitEvent: false});
      }
    });

    this.formGroup.get('checkOption')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.formGroup.get('loaiVay')?.enable();
        this.formGroup.get('choVay')?.enable();
      } else {
        this.formGroup.get('loaiVay')?.disable();
        this.formGroup.get('choVay')?.disable();
      }
    });

    this.formGroup.get('checkHopDongBaoLanh')?.valueChanges.subscribe(checked => {
      this.titleNguoiBaoLanh1 = checked ? 'Người bảo lãnh 1' : 'Người đứng tên bìa đỏ 1';
      this.titleNguoiBaoLanh2 = checked ? 'Người bảo lãnh 2' : 'Người đứng tên bìa đỏ 2';
    });

    this.formGroup.get('checkNguoiMangTenBiaDo')?.valueChanges.subscribe(checked => {
      if (checked) this.formGroup.get('nguoiMangTen')?.enable(); else this.formGroup.get('nguoiMangTen')?.disable();
    });

    this.formGroup.get('checkLoaiDat')?.valueChanges.subscribe(checked => {
      if (checked) this.formGroup.get('loaiDat')?.enable(); else this.formGroup.get('loaiDat')?.disable();
    });

    this.formGroup.get('checkMucDich')?.valueChanges.subscribe(checked => {
      if (checked) this.formGroup.get('muchDichSuDung')?.enable(); else this.formGroup.get('muchDichSuDung')?.disable();
    });
    this.formGroup.get('checkNguonGocSuDung')?.valueChanges.subscribe(checked => {
      if (checked) this.formGroup.get('nguonGocSuDung')?.enable(); else this.formGroup.get('nguonGocSuDung')?.disable();
    });

    this.formGroup.get('checkNhaCoDinh')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('nhaCoDinh');
      if (checked) {
        control?.enable();
        if (this.mode === 'create') {
          control?.setValue('- Nhà ở cố định:    m²;  loại nhà:      ; \nĐược định giá 0 đồng');
        } else if (this.mode === 'update') {
          control?.setValue(this.contractUpdate?.nhaCoDinh);
        }
      } else {
        control?.disable();
      }
    });

    this.formGroup.get('checkNguoiDungTenBiaDo2')?.valueChanges.subscribe(checked => {
      const controls = ['dungTenBiaDo2', 'gioiTinhDungTenBiaDo2', 'namSinhDungTenBiaDo2', 'cccdDungTenBiaDo2', 'ngayCapCCCDDungTenBiaDo2', 'noiCapCCCDDungTenBiaDo2', 'diaChiThuongTruDungTenBiaDo2'];
      controls.forEach(c => {
        const ctrl = this.formGroup.get(c);
        if (checked) ctrl?.enable(); else ctrl?.disable();
      });
    });
    (this.formGroup.get('tsbdRequest.checkTaiSanGanLienVoiDat') as FormControl)?.valueChanges.subscribe(checked => {
      const controls = ['dienTichTS', 'ketCauXayDung', 'loaiNha'];
      controls.forEach(c => {
        const ctrl = this.formGroup.get(`tsbdRequest.${c}`);
        if (checked) ctrl?.enable(); else ctrl?.disable();
      });
    });
    (this.formGroup.get('pavvRequest.checkAddress') as FormControl)?.valueChanges.subscribe(checked => {
      const controls = this.formGroup.get('pavvRequest.address');
      checked ? controls?.enable() : controls?.disable();
    });


    this.formGroup.get('checkGhiChu')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('ghiChu');
      if (checked) {
        control?.enable();
        if (this.mode === 'create') {
          control?.setValue('Ghi chú: Thửa đất số 203, tờ bản đồ số 39 ...');
        } else {
          control?.setValue(this.contractUpdate?.ghiChu);
        }
      } else {
        control?.disable();
        control?.setValue('');
      }
    });
    this.formGroup.get('loaiVay')?.valueChanges.subscribe(value => {
      const hanMucTable = this.formGroup.get('hanMucTable') as FormArray;
      hanMucTable.clear();

      if (value === 'NGẮN HẠN (Thỏa thuận)') {
        this.initHanMucTable(hanMucTable);
      }
    });
    // Lắng nghe số tiền vay
    this.formGroup.get('tienSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        const num = Number(String(rawValue).replace(/\./g, ''));
        this.tienChu = !isNaN(num) ? this.convertMoney.numberToVietnameseWordsMoney(num) : '';
      } else {
        this.tienChu = '';
      }
      this.updateReason();
    });

    // Lắng nghe loại phương án
    (this.formGroup.get('pavvRequest.loaiPhuongAn') as FormControl)?.valueChanges.subscribe(() => {
      this.updateReason();
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


  syncField(source: string, target: string) {
    this.formGroup.get(source)?.valueChanges.subscribe(value => {
      console.log('value -->', value)
      console.log('target -->', target);
      const targetCtrl = this.formGroup.get(target);
      if (targetCtrl?.pristine) {
        targetCtrl.patchValue(value, {emitEvent: false});
      }
    });
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

    const tcDate: Date = this.formGroup.get('ngayTheChap')?.value;
    const formattedDateTC = tcDate
      ? new Date(tcDate.getTime() - tcDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;

    const bdDate: Date = this.formGroup.get('ngayBaoDam')?.value;
    const formattedDateBD = bdDate
      ? new Date(bdDate.getTime() - bdDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;

    console.log('formattedDate -->', formattedDate);
    console.log('formattedDateTC -->', formattedDateTC);

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
      ngayTheChap: formattedDateTC,
      ngayBaoDam: formattedDateBD,
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest,
      table1: this.buildTableRequest(this.table1),
      table2: this.buildTableRequest(this.table2),
      table3: this.buildTableRequest(this.table3),
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

  // 👉 Export file (create hoặc update)
  onExport(): void {
    const rawDateStr: string = this.formGroup.get('contractDate')?.value;
    const rawDate = rawDateStr ? new Date(rawDateStr) : null;

    const formattedDate = rawDate
      ? new Date(rawDate.getTime() - rawDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;

    const tcDateStr: string = this.formGroup.get('ngayTheChap')?.value;
    const bdDateStr: string = this.formGroup.get('ngayBaoDam')?.value;
    console.log('bdDateStr ---> ', bdDateStr);
    const tcDate = tcDateStr ? new Date(tcDateStr) : null;
    const bdDate = bdDateStr ? new Date(bdDateStr) : null;

    const formattedDateTC = tcDate
      ? new Date(tcDate.getTime() - tcDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]
      : null;
    const formattedDateBD = bdDate
      ? new Date(bdDate.getTime() - bdDate.getTimezoneOffset() * 60000)
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
      ngayTheChap: formattedDateTC,
      ngayBaoDam: formattedDateBD,
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest,
      table1: this.buildTableRequest(this.table1),
      table2: this.buildTableRequest(this.table2),
      table3: this.buildTableRequest(this.table3),
      hanMucTable: this.buildHanMucTableRequest(this.hanMucTable),
      chiPhiTable: this.buildChiPhiTableRequest(this.chiPhiTable),
      thuNhapDuKienTable: this.buildThuNhapTableRequest(this.thuNhapTable),
      phuLucHanMucTable: this.buildPhuLucHanMucTableRequest(this.phuLucHanMucTable),
      giaTriQuyenSuDungDat: this.giaTriQuyenSuDungDat
    };
    console.log('playload -->', payload)
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
    this.tableRows.push(this.fb.group({
      col1: ['Lần 1'],
      col2: ['11/11/2026'],
      col3: ['60.000.000, đồng']
    }));
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

  calculateTongTaiSanBD() {
    console.log('== calculateTongTaiSanBD ==');

    const landItems = this.formGroup.get('landItems')?.value;
    if (!landItems) return;

    // Regex bắt các giá trị định giá
    const regex = /định giá là:\s*([\d\.]+)\s*đồng/g;
    let total = 0;

    const matches = landItems.matchAll(regex);
    for (const match of matches) {
      const value = Number(match[1].replace(/\./g, ''));
      if (!isNaN(value)) {
        total += value;
      }
    }

    // Format số và chuyển sang chữ
    const tongTaiSanBD = new Intl.NumberFormat('vi-VN').format(total);
    const tongTaiSanBDChu = this.convertMoney.numberToVietnameseWordsMoney(total);

    // ✅ cập nhật trực tiếp vào form controls
    this.formGroup.patchValue({ tongTaiSanBD, tongTaiSanBDChu });

    // ✅ cập nhật col7 của dòng đầu tiên table2 (nếu có)
    if (this.table2 && this.table2.length > 0) {
      const firstRow = this.table2.at(0) as FormGroup;
      if (firstRow?.get('col7')) {
        firstRow.get('col7')?.setValue(tongTaiSanBD, { emitEvent: false });
      }
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
    const table1 = this.table1;
    if (table1.length === 0) {
      const row1T1 = this.createRow({col1: 'Giá đất ở của nhà nước quy định', col3: 'đ/m²'});
      row1T1.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row1T1));
      row1T1.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row1T1));
      table1.push(row1T1);

      // const row2T1 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      const row2T1 = this.createRow({
        col1: 'Giá đất khác',
        col2: '140.000',   // ✅ mặc định
        col3: 'đ/m²'
      });
      row2T1.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row2T1));
      console.log('row2T1 col2 default:', row2T1.get('col2')?.value);
      row2T1.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row2T1));
      table1.push(row2T1);
    }

    const table2 = this.table2;
    if (table2.length === 0) {
      const row1T2 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
      row1T2.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row1T2));
      row1T2.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row1T2));
      table2.push(row1T2);

      const row2T2 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      row2T2.get('col5')?.valueChanges.subscribe(() => this.updateTable2Row(row2T2));
      row2T2.get('col7')?.valueChanges.subscribe(() => this.updateTable2Row(row2T2));
      table2.push(row2T2);
    }

    const table3 = this.table3;
    if (table3.length === 0) {
      const row1T3 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
      row1T3.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row1T3));
      row1T3.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row1T3));
      table3.push(row1T3);

      const row2T3 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      row2T3.get('col2')?.valueChanges.subscribe(() => this.updateTable1Row(row2T3));
      row2T3.get('col5')?.valueChanges.subscribe(() => this.updateTable1Row(row2T3));
      table3.push(row2T3);
    }
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


  get table1(): FormArray<FormGroup> {
    return this.formGroup.get('table1') as FormArray<FormGroup>;
  }


  get table2(): FormArray<FormGroup> {
    return this.formGroup.get('table2') as FormArray<FormGroup>;
  }

  get table3(): FormArray<FormGroup> {
    return this.formGroup.get('table3') as FormArray<FormGroup>;
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
      Number(table.at(0).get('col7')?.value || 0) +
      Number(table.at(1).get('col7')?.value || 0);
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

  get giaTriQuyenSuDungDat(): number {
    const table = this.table3;
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

  onInputChange(event: any, row: FormGroup, field: string) {
    const raw = event.target.value.replace(/\./g, '');
    const value = Number(raw) || 0;

    // cập nhật giá trị số để tính toán
    row.get(field)?.setValue(value);

    // ✅ nếu là col2 thì format hiển thị ngay
    if (field === 'col2') {
      event.target.value = value.toLocaleString('vi-VN');
    }

    const soLuong = Number(row.get('soLuong')?.value || 0);
    const donGia = Number(row.get('donGia')?.value || 0);
    const thanhTien = soLuong * donGia;
    row.get('thanhTien')?.setValue(thanhTien);

    const changedIndex = this.chiPhiRows.indexOf(row);
    this.updateParentRows(changedIndex);
  }

  formatOnBlur(row: FormGroup, field: string) {
    let rawValue = row.get(field)?.value?.toString().replace(/[^\d]/g, '') || '0';
    let value = Number(rawValue);

    // ✅ thêm xử lý cho col2
    if (field === 'col2') {
      row.patchValue({ [field]: value.toLocaleString('vi-VN') });
    }

    if (field === 'soLuong' || field === 'donGia') {
      row.patchValue({ [field]: value.toLocaleString('vi-VN') });
      const soLuong = Number((row.get('soLuong')?.value || '0').toString().replace(/[^\d]/g, ''));
      const donGia = Number((row.get('donGia')?.value || '0').toString().replace(/[^\d]/g, ''));
      const thanhTien = soLuong * donGia;
      row.patchValue({ thanhTien: thanhTien.toLocaleString('vi-VN') });
    } else if (field === 'thanhTien') {
      row.patchValue({ [field]: value.toLocaleString('vi-VN') });
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

  // onInputChangePhuLucHanMuc(event: any, row: FormGroup, field: string) {
  //   let value = event.target.value.replace(/\D/g, '');
  //   row.get(field)?.setValue(value);
  //   this.calculateTongSoDuPhuLuc();
  // }

  initPhuLucHanMucTable() {
    this.phuLucHanMucTable.clear();

    // Thêm một row trống mặc định
    this.addPhuLucHanMucRow();

    // Tính tổng ngay từ đầu
    this.calculateTongSoDuPhuLuc();
  }


}
