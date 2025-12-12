import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {CreditContractService} from "../../../service/credit-contract.service";
import {CreditContract} from "../../../model/CreditContract";
import {ConvertMoney} from "../../../config/ConvertMoney";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UploadMultipleAvatarService} from "../../../service/upload-multiple-avatar.service";
import {FileMetadataEntity} from "../../../model/FileMetadataEntity";

@Component({
  selector: 'app-create-credit-contract',
  templateUrl: './create-credit-contract.component.html',
  styleUrls: ['./create-credit-contract.component.css']
})
export class CreateCreditContractComponent implements OnInit {
  formGroup = new FormGroup({
    contractDate: new FormControl<Date | null>(new Date()),
    nguoiDaiDien: new FormControl<string>('Bà: PHÙNG THỊ LOAN - Chức vụ: Giám đốc điều hành'),
    tenKhachHang: new FormControl<string>(''),
    gtkh: new FormControl<string>(''),
    namSinhKhachHang: new FormControl<string>(''),
    phoneKhachHang: new FormControl<string>(''),
    soTheThanhVienKhachHang: new FormControl<string>(''),
    cccdKhachHang: new FormControl<string>(''),
    ngayCapCCCDKhachHang: new FormControl<string>(''),
    diaChiThuongTruKhachHang: new FormControl<string>('phường Chu Văn An, thành phố Hải Phòng'),
    // Người Thân
    tenNguoiThan: new FormControl<string>(''),
    gtnt: new FormControl<string>(''),
    namSinhNguoiThan: new FormControl<string>(''),
    cccdNguoiThan: new FormControl<string>(''),
    ngayCapCCCDNguoiThan: new FormControl<string>(''),
    diaChiThuongTruNguoiThan: new FormControl<string>('phường Chu Văn An, thành phố Hải Phòng'),
    quanHe: new FormControl<string>('Là vợ'),
    // Thêm ô nhập số tiền
    tienSo: new FormControl<string>(''),
    tienChu: new FormControl<string>(''),
    mucDichVay: new FormControl<string>(''),
    hanMuc: new FormControl<string>(''),
    laiSuat: new FormControl<string>('7,5%/năm'),
    soHopDongTheChapQSDD: new FormControl<string>('123/2025/HĐQSDĐ'),
    //Thông tin Bìa Đỏ
    serial: new FormControl<string>(''),
    noiCapSo: new FormControl<string>(''),
    ngayCapSo: new FormControl<string>(''),
    noiDungVaoSo: new FormControl<string>('1703 QSDĐ/TH-CL'),
    soThuaDat: new FormControl<string>(''),
    soBanDo: new FormControl<string>(''),
    diaChiThuaDat: new FormControl<string>('...,huyện Chí Linh, tỉnh Hải Dương nay là Phường Chu Văn An, thành phố Hải Phòng'),
    dienTichDatSo: new FormControl<string>(''),
    dienTichDatChu: new FormControl(''),
    hinhThucSuDung: new FormControl('+ Sử dụng riêng: 690  m2; + Sử dụng chung: 0 m2'),
    muchDichSuDung: new FormControl('+ Đất ở: 200 m2; + Đất thừa hợp pháp: 490 m2'),
    thoiHanSuDung: new FormControl('Lâu dài'),
    soBienBanDinhGia: new FormControl('01/077'),
    noiDungThoaThuan: new FormControl('là một mảnh đất ở hợp pháp lâu dài với diện tích'),
    checkNguonGocSuDung: new FormControl<boolean>(false),
    nguonGocSuDung: new FormControl<string>('Nguồn gốc sử dụng: Nhà nước giao đất có thu tiền sử dụng đất.Nhận chuyển nhượng QSD đất của ông Nguyễn Đình Chiến và bà Nguyễn Thị Xuyến.'),
    // Checkbox + input cho Ghi chú
    checkGhiChu: new FormControl<boolean>(false),
    ghiChu: new FormControl<string>(''),
  });
  fileUrls: string[] = [];

  tienChu: string = '';

  constructor(
    private creditContractService: CreditContractService,
    private convertMoney: ConvertMoney,
    private sanitizer: DomSanitizer,
    private uploadService: UploadMultipleAvatarService
  ) {
  }

  onSubmit() {
    const selectedDate = this.formGroup.value.contractDate;
    if (!selectedDate) {
      console.error('Ngày chưa được chọn');
      return;
    }

    const payload: CreditContract = {
      contractDate: selectedDate.toISOString().substring(0, 10),
      nguoiDaiDien: this.formGroup.value.nguoiDaiDien ?? '',
      tenKhachHang: this.formGroup.value.tenKhachHang ?? '',
      gtkh: this.formGroup.value.gtkh ?? '',
      namSinhKhachHang: this.formGroup.value.namSinhKhachHang ?? '',
      phoneKhachHang: this.formGroup.value.phoneKhachHang ?? '',
      soTheThanhVienKhachHang: this.formGroup.value.soTheThanhVienKhachHang ?? '',
      cccdKhachHang: this.formGroup.value.cccdKhachHang ?? '',
      ngayCapCCCDKhachHang: this.formGroup.value.ngayCapCCCDKhachHang ?? '',
      diaChiThuongTruKhachHang: this.formGroup.value.diaChiThuongTruKhachHang ?? '',
      gtnt: this.formGroup.value.gtnt ?? '',
      tenNguoiThan: this.formGroup.value.tenNguoiThan ?? '',
      namSinhNguoiThan: this.formGroup.value.namSinhNguoiThan ?? '',
      cccdNguoiThan: this.formGroup.value.cccdNguoiThan ?? '',
      ngayCapCCCDNguoiThan: this.formGroup.value.ngayCapCCCDNguoiThan ?? '',
      diaChiThuongTruNguoiThan: this.formGroup.value.diaChiThuongTruNguoiThan ?? '',
      quanHe: this.formGroup.value.quanHe ?? '',
      // thêm số tiền vay nếu cần gửi backend
      tienSo: this.formGroup.value.tienSo ?? '',
      tienChu: this.tienChu ?? '',
      muchDichVay: this.formGroup.value.mucDichVay ?? '',
      hanMuc: this.formGroup.value.hanMuc ?? '',
      laiSuat: this.formGroup.value.laiSuat ?? '',
      soHopDongTheChapQSDD: this.formGroup.value.soHopDongTheChapQSDD ?? '',
      //Thông bin sổ đỏ
      serial: this.formGroup.value.serial ?? '',
      noiCapSo: this.formGroup.value.noiCapSo ?? '',
      ngayCapSo: this.formGroup.value.ngayCapSo ?? '',
      noiDungVaoSo: this.formGroup.value.noiDungVaoSo ?? '',
      soThuaDat: this.formGroup.value.soThuaDat ?? '',
      soBanDo: this.formGroup.value.soBanDo ?? '',
      diaChiThuaDat: this.formGroup.value.diaChiThuaDat ?? '',
      dienTichDatSo: this.formGroup.value.dienTichDatSo ?? '',
      dienTichDatChu: this.formGroup.value.dienTichDatChu ?? '',
      hinhThucSuDung: this.formGroup.value.hinhThucSuDung ?? '',
      muchDichSuDung: this.formGroup.value.muchDichSuDung ?? '',
      thoiHanSuDung: this.formGroup.value.thoiHanSuDung ?? '',
      soBienBanDinhGia: this.formGroup.value.soBienBanDinhGia ?? '',
      noiDungThoaThuan: this.formGroup.value.noiDungThoaThuan ?? '',
      nguonGocSuDung: this.formGroup.value.checkNguonGocSuDung
        ? this.formGroup.value.nguonGocSuDung ?? ''
        : '',
      ghiChu: this.formGroup.value.checkGhiChu
        ? this.formGroup.value.ghiChu ?? ''
        : '',
      fileAvatarUrls: this.fileAvatarUrls
    };

    // 👉 Gọi API và nhận danh sách URL
    this.creditContractService.createCreditContract(payload).subscribe((fileUrls: string[]) => {
      console.log('Danh sách file:', fileUrls);
      // Lưu lại để hiển thị preview
      this.fileUrls = fileUrls;
    });
  }

  ngOnInit(): void {
    this.formGroup.get('tienSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
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
    this.formGroup.get('dienTichDatSo')?.valueChanges.subscribe(rawValue => {
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
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

    // Khởi tạo: disable sẵn 2 ô này
    this.formGroup.get('nguonGocSuDung')?.disable();
    this.formGroup.get('ghiChu')?.disable();
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

  getGoogleViewerUrl(fileUrl: string): SafeResourceUrl {
    const googleUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent(fileUrl) + '&embedded=true';
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleUrl);
  }


  // protected readonly url = module


  fileAvatarUrls: FileMetadataEntity[] = [];


  onFilesSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.uploadService.uploadFiles(files).subscribe({
      next: (res) => {
        console.log('Upload trả về:', res);
        this.fileAvatarUrls = res; // lưu danh sách object FileMetadataEntity
      },
      error: (err) => console.error('Upload thất bại:', err)
    });
  }

  onExport() {
    const selectedDate = this.formGroup.value.contractDate as Date;
    if (!selectedDate) {
      console.error('Ngày chưa được chọn');
      return;
    }

    const payload: CreditContract = {
      contractDate: selectedDate.toISOString().substring(0, 10),
      nguoiDaiDien: this.formGroup.value.nguoiDaiDien ?? '',
      tenKhachHang: this.formGroup.value.tenKhachHang ?? '',
      gtkh: this.formGroup.value.gtkh ?? '',
      namSinhKhachHang: this.formGroup.value.namSinhKhachHang ?? '',
      phoneKhachHang: this.formGroup.value.phoneKhachHang ?? '',
      soTheThanhVienKhachHang: this.formGroup.value.soTheThanhVienKhachHang ?? '',
      cccdKhachHang: this.formGroup.value.cccdKhachHang ?? '',
      ngayCapCCCDKhachHang: this.formGroup.value.ngayCapCCCDKhachHang ?? '',
      diaChiThuongTruKhachHang: this.formGroup.value.diaChiThuongTruKhachHang ?? '',
      gtnt: this.formGroup.value.gtnt ?? '',
      tenNguoiThan: this.formGroup.value.tenNguoiThan ?? '',
      namSinhNguoiThan: this.formGroup.value.namSinhNguoiThan ?? '',
      cccdNguoiThan: this.formGroup.value.cccdNguoiThan ?? '',
      ngayCapCCCDNguoiThan: this.formGroup.value.ngayCapCCCDNguoiThan ?? '',
      diaChiThuongTruNguoiThan: this.formGroup.value.diaChiThuongTruNguoiThan ?? '',
      quanHe: this.formGroup.value.quanHe ?? '',
      // thêm số tiền vay nếu cần gửi backend
      tienSo: this.formGroup.value.tienSo ?? '',
      tienChu: this.tienChu ?? '',
      muchDichVay: this.formGroup.value.mucDichVay ?? '',
      hanMuc: this.formGroup.value.hanMuc ?? '',
      laiSuat: this.formGroup.value.laiSuat ?? '',
      soHopDongTheChapQSDD: this.formGroup.value.soHopDongTheChapQSDD ?? '',
      //Thông bin sổ đỏ
      serial: this.formGroup.value.serial ?? '',
      noiCapSo: this.formGroup.value.noiCapSo ?? '',
      ngayCapSo: this.formGroup.value.ngayCapSo ?? '',
      noiDungVaoSo: this.formGroup.value.noiDungVaoSo ?? '',
      soThuaDat: this.formGroup.value.soThuaDat ?? '',
      soBanDo: this.formGroup.value.soBanDo ?? '',
      diaChiThuaDat: this.formGroup.value.diaChiThuaDat ?? '',
      dienTichDatSo: this.formGroup.value.dienTichDatSo ?? '',
      dienTichDatChu: this.formGroup.value.dienTichDatChu ?? '',
      hinhThucSuDung: this.formGroup.value.hinhThucSuDung ?? '',
      muchDichSuDung: this.formGroup.value.muchDichSuDung ?? '',
      thoiHanSuDung: this.formGroup.value.thoiHanSuDung ?? '',
      soBienBanDinhGia: this.formGroup.value.soBienBanDinhGia ?? '',
      noiDungThoaThuan: this.formGroup.value.noiDungThoaThuan ?? '',
      nguonGocSuDung: this.formGroup.value.checkNguonGocSuDung
        ? this.formGroup.value.nguonGocSuDung ?? ''
        : '',
      ghiChu: this.formGroup.value.checkGhiChu
        ? this.formGroup.value.ghiChu ?? ''
        : '',
      fileAvatarUrls: this.fileAvatarUrls
    };

    this.creditContractService.exportContract(payload, this.fileAvatarUrls).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contracts.zip'; // hoặc tên file từ backend
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Export thất bại:', err);
      }
    });

  }


}
