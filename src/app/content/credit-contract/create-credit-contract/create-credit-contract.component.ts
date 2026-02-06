import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CreditContractService} from "../../../service/credit-contract.service";
import {CreditContract} from "../../../model/CreditContract";
import {ConvertMoney} from "../../../config/ConvertMoney";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UploadMultipleAvatarService} from "../../../service/upload-multiple-avatar.service";
import {FileMetadataEntity} from "../../../model/FileMetadataEntity";
import {ActivatedRoute} from "@angular/router";
import {TableRequest} from "../../../model/TableRequest";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";

@Component({
  selector: 'app-create-credit-contract',
  templateUrl: './create-credit-contract.component.html',
  styleUrls: ['./create-credit-contract.component.css']
})
export class CreateCreditContractComponent implements OnInit {
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
        // Patch các field đơn giản (strings, booleans, dates)
        this.patchSimpleFields(contract);
        this.loadTableArray(contract.table1, this.table1, 7);
        this.loadTableArray(contract.table2, this.table2, 7);
        this.loadTableArray(contract.table3, this.table3, 7);
        // File avatars
        this.fileAvatarUrls = contract.fileAvatarUrls ?? [];
        // Các control enable/disable theo checkbox
        this.applyConditionalControls(contract);
        // Nếu có ngày, set lại control date (đặt sau patchSimpleFields để tránh override)
        if (contract.contractDate) {
          this.formGroup.get('contractDate')?.setValue(new Date(contract.contractDate));
        }
        if (contract.ngayTheChap) {
          this.formGroup.get('ngayTheChap')?.setValue(new Date(contract.ngayTheChap));
        }
        if (contract.ngayBaoDam) {
          this.formGroup.get('ngayBaoDam')?.setValue(new Date(contract.ngayBaoDam));
        }
      });
    }

    // Các listener khác (valueChanges)
    this.setupValueChangeListeners();

    // Khởi tạo bảng rỗng nếu cần
    this.initTables();
  }

  /* ---------- Helper methods ---------- */

  private initForm(): void {
    this.formGroup = this.fb.group({
      contractDate: [new Date()],
      ngayTheChap: [new Date()],
      ngayBaoDam: [new Date()],
      soHopDongTD: ['01/25/232/HĐTD'],
      nguoiDaiDien: ['PHÙNG THỊ LOAN - Chức vụ: Giám đốc điều hành'],
      tenKhachHang: [''],
      gtkh: [''],
      namSinhKhachHang: [''],
      phoneKhachHang: [''],
      soTheThanhVienKhachHang: [''],
      cccdKhachHang: [''],
      ngayCapCCCDKhachHang: [''],
      diaChiThuongTruKhachHang: [', phường Chu Văn An, thành phố Hải Phòng.'],
      gtnt: [''],
      tongTaiSanBD: [''],
      tongTaiSanBDChu: [''],
      tenNguoiThan: [''],
      namSinhNguoiThan: [''],
      cccdNguoiThan: [''],
      ngayCapCCCDNguoiThan: [''],
      diaChiThuongTruNguoiThan: [', phường Chu Văn An, thành phố Hải Phòng.'],
      quanHe: ['Là vợ'],
      tienSo: [''],
      muchDichVay: [''],
      soBBXetDuyetChoVay: [''],
      hanMuc: [''],
      laiSuat: ['7,5%/năm'],
      ngayKetThucKyHanVay: [''],
      soHopDongTheChapQSDD: ['07/26/006/HĐTC'],
      serial: [''],
      noiCapSo: [''],
      ngayCapSo: [''],
      noiDungVaoSo: ['1703 QSDĐ/TH-CL'],
      soThuaDat: [''],
      noiDungNgoaiBia: [''],
      soBanDo: [''],
      diaChiThuaDat: [', huyện Chí Linh, tỉnh Hải Dương Nay là Phường Chu Văn An, thành phố Hải Phòng'],
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
      loaiDat: [{value: '+ Đất ở tại đô thị: 50m²; + Đất trồng cây lâu năm 55,3m²', disabled: true}],
      nhaCoDinh: [{value: '- Nhà ở cố định:    m²;  loại nhà:      ; \nĐược định giá 0 đồng', disabled: true}],
      checkNguoiDungTenBiaDo2: [false],
      checkHopDongBaoLanh: [false],
      landItems: ['+ Đất ở: 120m²; được định giá là: 1.200.000.000 đồng\n+ Đất LNK: 300m²; được định giá là: 2.500.000.000 đồng\n+ Đất ao: 300m²; được định giá là: 2.500.000.000 đồng'],
      hasTable: [false],
      tableHeaders: this.fb.array([
        this.fb.control('Kỳ trả nợ'),
        this.fb.control('Đến ngày, tháng, năm'),
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
      nguoiMangTen: [{ value: 'mang tên ...', disabled: true }],
      table1: this.fb.array([]),
      table2: this.fb.array([]),
      table3: this.fb.array([])
    });
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
  }

  private patchSimpleFields(contract: any): void {
    // Patch những field đơn giản, tránh patch toàn bộ object
    this.formGroup.patchValue({
      soHopDongTD: contract.soHopDongTD,
      nguoiDaiDien: contract.nguoiDaiDien,
      tenKhachHang: contract.tenKhachHang,
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
      diaChiThuongTruNguoiThan: contract.diaChiThuongTruNguoiThan,
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
      hasTable: contract.tableRequest?.drawTable ?? false
    });
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
    this.formGroup.patchValue({ hasTable: !!tableRequest.drawTable });
  }

  loadTableArray(tableData: { rows: string[][] } | undefined, table: FormArray, colCount: number) {
    table.clear();
    if (!tableData || !tableData.rows) {
      return;
    }

    tableData.rows.forEach(rowData => {
      const row = this.createRow();

      // Patch dữ liệu vào các cột
      for (let i = 0; i < colCount; i++) {
        const key = `col${i + 1}`;
        if (rowData[i] !== undefined) {
          row.get(key)?.setValue(rowData[i]);
        }
      }

      // Gắn listener để tính col7 khi col2 hoặc col5 thay đổi
      row.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row));
      row.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row));

      table.push(row);

      // Tính lại col7 ngay sau khi patch
      this.updateCol6(row);
    });
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
    this.formGroup.get('tienSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        const num = Number(String(rawValue).replace(/\./g, ''));
        this.tienChu = !isNaN(num) ? this.convertMoney.numberToVietnameseWordsMoney(num) : '';
      } else {
        this.tienChu = '';
      }
    });

    this.formGroup.get('landItems')?.valueChanges.subscribe(() => {
      this.calculateTongTaiSanBD();
    });

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
      const controls = ['dungTenBiaDo2','gioiTinhDungTenBiaDo2','namSinhDungTenBiaDo2','cccdDungTenBiaDo2','ngayCapCCCDDungTenBiaDo2','noiCapCCCDDungTenBiaDo2','diaChiThuongTruDungTenBiaDo2'];
      controls.forEach(c => {
        const ctrl = this.formGroup.get(c);
        if (checked) ctrl?.enable(); else ctrl?.disable();
      });
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
      giaTriQuyenSuDungDat: this.giaTriQuyenSuDungDat
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

  convertToWords() {
    const rawValue = this.formGroup.get('tienSo')?.value;
    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      // bỏ dấu chấm ngăn cách nếu có
      const num = Number(String(rawValue).replace(/\./g, ''));
      if (!isNaN(num)) {
        this.tienChu = this.convertMoney.numberToVietnameseWordsMoney(num);
      } else {
        this.tienChu = '';
      }
    } else {
      this.tienChu = '';
    }
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
    const landItems = this.formGroup.get('landItems')?.value;
    if (!landItems) return;

    const regex = /định giá là:\s*([\d\.]+)\s*đồng/g;
    let total = 0;

    const matches = landItems.matchAll(regex);
    for (const match of matches) {
      const value = Number(match[1].replace(/\./g, ''));
      if (!isNaN(value)) {
        total += value;
      }
    }

    const tongTaiSanBD = new Intl.NumberFormat('vi-VN').format(total);
    const tongTaiSanBDChu = this.convertMoney.numberToVietnameseWordsMoney(total);
    // ✅ cập nhật trực tiếp vào form controls
    this.formGroup.patchValue({tongTaiSanBD, tongTaiSanBDChu});

  }

  createRow(defaults: { col1?: string, col3?: string, col5?: string } = {}): FormGroup {
    return this.fb.group({
      col1: [defaults.col1 || ''],
      col2: [''],
      col3: [defaults.col3 || ''],
      col4: ['x'],
      col5: [''],
      col6: ['m²'],
      col7: [{value: '', disabled: true}]
    });
  }

  initTables() {
    const table1 = this.table1;
    if (table1.length === 0) {
      const row1T1 = this.createRow({col1: 'Giá đất ở của nhà nước quy định', col3: 'đ/m²'});
      row1T1.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row1T1));
      row1T1.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row1T1));
      table1.push(row1T1);

      const row2T1 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      row2T1.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row2T1));
      row2T1.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row2T1));
      table1.push(row2T1);
    }

    const table2 = this.table2;
    if (table2.length === 0) {
      const row1T2 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
      row1T2.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row1T2));
      row1T2.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row1T2));
      table2.push(row1T2);

      const row2T2 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      row2T2.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row2T2));
      row2T2.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row2T2));
      table2.push(row2T2);
    }

    const table3 = this.table3;
    if (table3.length === 0) {
      const row1T3 = this.createRow({col1: 'Giá đất trên thị trường', col3: 'đ/m²'});
      row1T3.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row1T3));
      row1T3.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row1T3));
      table3.push(row1T3);

      const row2T3 = this.createRow({col1: 'Giá đất khác', col3: 'đ/m²'});
      row2T3.get('col2')?.valueChanges.subscribe(() => this.updateCol6(row2T3));
      row2T3.get('col5')?.valueChanges.subscribe(() => this.updateCol6(row2T3));
      table3.push(row2T3);
    }
  }


  updateCol6(row: FormGroup) {
    const rawCol2 = row.get('col2')?.value || '0';
    const rawCol5 = row.get('col5')?.value || '0';

    const col2 = Number(String(rawCol2).replace(/\./g, ''));
    const col5 = Number(String(rawCol5).replace(/\./g, ''));

    const result = col2 * col5;

    // Format lại kết quả có dấu chấm
    const formatted = result.toLocaleString('vi-VN');
    row.get('col7')?.setValue(formatted, {emitEvent: false});
  }

  get table1(): FormArray {
    return this.formGroup.get('table1') as FormArray;
  }

  get table2(): FormArray {
    return this.formGroup.get('table2') as FormArray;
  }

  get table3(): FormArray {
    return this.formGroup.get('table3') as FormArray;
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
        row.get('col7')?.value || ''
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
}
