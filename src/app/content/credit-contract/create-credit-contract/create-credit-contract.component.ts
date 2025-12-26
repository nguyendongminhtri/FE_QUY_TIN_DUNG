import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
    // Lấy id từ route nếu có
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.contractId = Number(idParam);
      this.mode = 'update';
    }

    // Khởi tạo form
    this.formGroup = this.fb.group({
      contractDate: [new Date()],
      soHopDongTD: ['01/25/232/HĐTD'],
      nguoiDaiDien: ['Bà: PHÙNG THỊ LOAN - Chức vụ: Giám đốc điều hành'],
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
      mucDichVay: [''],
      hanMuc: [''],
      laiSuat: ['7,5%/năm'],
      ngayKetThucKyHanVay: [''],
      soHopDongTheChapQSDD: ['123/2025/HĐQSDĐ'],
      serial: [''],
      noiCapSo: [''],
      ngayCapSo: [''],
      noiDungVaoSo: ['1703 QSDĐ/TH-CL'],
      soThuaDat: [''],
      soBanDo: [''],
      diaChiThuaDat: [', huyện Chí Linh, tỉnh Hải Dương Nay là Phường Chu Văn An, thành phố Hải Phòng'],
      dienTichDatSo: [''],
      dienTichDatChu: [''],
      hinhThucSuDung: ['+ Sử dụng riêng: 690  m²; + Sử dụng chung: 0 m²'],
      muchDichSuDung: ['+ Đất ở: 200 m²; + Đất thừa hợp pháp: 490 m²'],
      thoiHanSuDung: ['Lâu dài'],
      soBienBanDinhGia: ['01/077 '],
      noiDungThoaThuan: ['là một mảnh đất ở hợp pháp lâu dài với diện tích '],
      checkNguonGocSuDung: [false],
      nguonGocSuDung: [{value: '', disabled: true}],
      checkGhiChu: [false],
      ghiChu: [{value: '', disabled: true}],
      // loaiVay: [{value: '', disabled: true}],
      // choVay: [{value: 'Cho vay:', disabled: true}],
      // checkOption: [false],
      checkNhaCoDinh: [false],
      nhaCoDinh: [{value: '+ Nhà ở cố định:    m²;  loại nhà:      ; Không được định giá', disabled: true}],
      checkNguoiDungTenBiaDo2: [false],
      dungTenBiaDo2: [{value: 'Và: ', disabled: true}],
      landItems: ['+ Đất ở: 120m²; được định giá là: 1.200.000.000 đồng\n' +
      '+ Đất LNK: 300m²; được định giá là: 2.500.000.000 đồng\n' +
      '+ Đất ao: 300m²; được định giá là: 2.500.000.000 đồng'],
      hasTable: [false],
      tableHeaders: this.fb.array([
        this.fb.control('Kỳ trả nợ'), // cột 1
        this.fb.control('Đến ngày, tháng, năm'), // cột 2
        this.fb.control('Số tiền phải trả')  // cột 3
      ]),
      tableRows: this.fb.array([])
    });

    // Nếu là update, load dữ liệu cũ
    if (this.mode === 'update' && this.contractId) {
      this.creditContractService.getContractById(this.contractId).subscribe(contract => {
        console.log('contract update:::', contract)
        this.formGroup.patchValue(contract);
        this.fileAvatarUrls = contract.avatars ?? [];
        if (contract.contractDate) {
          this.formGroup.get('contractDate')?.setValue(new Date(contract.contractDate));
        }
        if (contract.tableJson) {
          this.tableData = JSON.parse(contract.tableJson) as TableRequest;

          // reset headers
          this.tableHeaders.clear();
          this.tableData.headers.forEach(h => this.tableHeaders.push(this.fb.control(h)));

          // reset rows
          this.tableRows.clear();
          this.tableData.rows.forEach(r => {
            this.tableRows.push(this.fb.group({
              col1: [r[0] || ''],
              col2: [r[1] || ''],
              col3: [r[2] || '']
            }));
          });
          this.formGroup.patchValue({hasTable: this.tableData.drawTable});
        } else {
          this.tableData = null;
        }
        // if (contract.checkOption) {
        //   this.formGroup.get('loaiVay')?.enable();
        //   this.formGroup.get('choVay')?.enable();
        // }
        if (contract.checkNguoiDungTenBiaDo2) {
          this.formGroup.get('dungTenBiaDo2')?.enable();
          this.formGroup.get('dungTenBiaDo2')?.setValue(contract.dungTenBiaDo2);
        }
        if (contract.checkGhiChu) {
          this.formGroup.get('ghiChu')?.enable();
          this.formGroup.get('ghiChu')?.setValue(contract.ghiChu);
        }
        // if (contract.loaiVay) {
        //   this.formGroup.get('loaiVay')?.enable();
        //   this.formGroup.get('loaiVay')?.setValue(contract.loaiVay);
        // }
        // if (contract.choVay) {
        //   this.formGroup.get('choVay')?.enable();
        //   this.formGroup.get('choVay')?.setValue(contract.choVay);
        // }
        if (contract.checkNhaCoDinh) {
          this.formGroup.get('nhaCoDinh')?.enable();
          this.formGroup.get('nhaCoDinh')?.setValue(contract.nhaCoDinh);
        }
      });
    }

    // Lắng nghe thay đổi số tiền để convert sang chữ
    this.formGroup.get('tienSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        const num = Number(String(rawValue).replace(/\./g, ''));
        if (!isNaN(num)) {
          this.tienChu = this.convertMoney.numberToVietnameseWordsMoney(num);
        } else {
          this.tienChu = '';
        }
      } else {
        this.tienChu = '';
      }
    });
    this.formGroup.get('landItems')?.valueChanges.subscribe(() => {
      this.calculateTongTaiSanBD();
    });
    // Lắng nghe diện tích để convert sang chữ
    this.formGroup.get('dienTichDatSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue) {
        const num = Number(String(rawValue).replace(/\./g, ''));
        if (!isNaN(num)) {
          const chu = this.convertMoney.numberToVietnamese(num);
          this.formGroup.get('dienTichDatChu')?.setValue(chu, {emitEvent: false});
        } else {
          this.formGroup.get('dienTichDatChu')?.setValue('', {emitEvent: false});
        }
      } else {
        this.formGroup.get('dienTichDatChu')?.setValue('', {emitEvent: false});
      }
    });
    // this.formGroup.get('checkOption')?.valueChanges.subscribe(checked => {
    //   if (checked) {
    //     this.formGroup.get('loaiVay')?.enable();
    //     this.formGroup.get('choVay')?.enable();
    //   } else {
    //     this.formGroup.get('loaiVay')?.disable();
    //     this.formGroup.get('choVay')?.disable();
    //   }
    // });
    this.formGroup.get('checkNhaCoDinh')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.formGroup.get('nhaCoDinh')?.enable();
      } else {
        this.formGroup.get('nhaCoDinh')?.disable();
      }
    });
    this.formGroup.get('checkNguoiDungTenBiaDo2')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.formGroup.get('dungTenBiaDo2')?.enable();
      } else {
        this.formGroup.get('dungTenBiaDo2')?.disable();
      }
    });
    // Nguồn gốc sử dụng
    this.formGroup.get('checkNguonGocSuDung')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('nguonGocSuDung');
      if (checked) {
        control?.enable();
        control?.setValue('Nguồn gốc sử dụng: Nhà nước giao đất có thu tiền sử dụng đất.Nhận chuyển nhượng QSD đất của ông Nguyễn Đình Chiến và bà Nguyễn Thị Xuyến.')
      } else {
        control?.disable();
        control?.setValue('');
      }
    });

    // Ghi chú
    this.formGroup.get('checkGhiChu')?.valueChanges.subscribe(checked => {
      const control = this.formGroup.get('ghiChu');
      if (checked) {
        control?.enable();
        control?.setValue('Ghi chú: Thửa đất số 203, tờ bản đồ số 39 được chỉnh lý từ lô LK3 tờ bản đồ quy hoạch chi tiết điểm dân cư mới Lạc Sơn, phường Thái Học. ')
      } else {
        control?.disable();
        control?.setValue('');
      }
    });
  }

  // 👉 Preview file
  onSubmit(): void {
    const rawDate: Date = this.formGroup.get('contractDate')?.value;
    const formattedDate = rawDate ? rawDate.toISOString().split('T')[0] : null;
    console.log('formattedDate', formattedDate);
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
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest
    };
    this.creditContractService.previewContract(payload).subscribe(urls => {
      this.fileUrls = urls;
    });
  }

  // 👉 Export file (create hoặc update)
  onExport(): void {
    const rawDate: Date = this.formGroup.get('contractDate')?.value;
    const formattedDate = rawDate ? rawDate.toISOString().split('T')[0] : null;
    console.log('formattedDate', formattedDate);
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
      tienChu: this.tienChu,
      fileAvatarUrls: this.fileAvatarUrls,
      tableRequest: tableRequest
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
  private downloadZip(blob: Blob): void {
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
    this.uploadService.uploadFiles(files).subscribe({
      next: (res) => {
        this.fileAvatarUrls = res;
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

    // Format số có dấu chấm phân cách
    this.tongTaiSanBD = new Intl.NumberFormat('vi-VN').format(total);

    // Chuyển sang chữ
    this.tongTaiSanBDChu = this.convertMoney.numberToVietnameseWordsMoney(total);
  }

}
