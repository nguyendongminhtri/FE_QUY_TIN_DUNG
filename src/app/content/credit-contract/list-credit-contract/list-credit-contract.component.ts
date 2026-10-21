import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreditContract} from "../../../model/CreditContract";
import {CreditContractService} from "../../../service/credit-contract.service";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-list-credit-contract',
  templateUrl: './list-credit-contract.component.html',
  styleUrls: ['./list-credit-contract.component.css']
})
export class ListCreditContractComponent implements OnInit {
  listCreditContract: CreditContract[] = [];
  dataSource: MatTableDataSource<CreditContract> = new MatTableDataSource<CreditContract>([]);

  // Trạng thái thu gọn / mở rộng bảng
  collapsed = false;

  // Cột luôn hiển thị (chuyển tên cột qua lại giữa các nhóm để tùy chỉnh)
  private readonly alwaysColumns: string[] = [
    'id', 'tenKhachHang', 'cccdKhachHang', 'loaiVay', 'soHopDongTD'
  ];

  // Nhóm cột bị ẩn khi thu gọn
  private readonly collapsibleColumns: string[] = [
    'namSinhKhachHang', 'phoneKhachHang', 'soTheThanhVienKhachHang',
    'reLoanSequence', 'muchDichVay', 'tatToan'
  ];

  // Cột thao tác luôn nằm cuối
  private readonly actionColumns: string[] = ['update', 'delete'];

  displayedColumns: string[] = [];

  // Từ khóa tìm kiếm
  searchKeyword: string = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private creditContractService: CreditContractService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.collapsed = localStorage.getItem('creditContractCollapsed') === 'true';
    this.updateColumns();
    this.loadListCreditContract();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('creditContractCollapsed', String(this.collapsed));
    this.updateColumns();
  }

  private updateColumns(): void {
    this.displayedColumns = [
      ...this.alwaysColumns,
      ...(this.collapsed ? [] : this.collapsibleColumns),
      ...this.actionColumns,
    ];
  }

  goToEdit(element: any) {
    this.router.navigate(['/credit-contract-update', element.id]);
  }

  loadListCreditContract() {
    this.creditContractService.getListCreditContract().subscribe(data => {
      this.listCreditContract = data;
      console.log('listCreditContract', this.listCreditContract);
      this.dataSource = new MatTableDataSource<CreditContract>(this.listCreditContract);
      this.dataSource.paginator = this.paginator ?? null;

      // filterPredicate custom để search gần đúng nhiều field
      this.dataSource.filterPredicate = (element: any, filter: string): boolean => {
        const normalize = (val: any) =>
          (val ?? '').toString().toLowerCase().normalize('NFC');

        const searchableFields = [
          element.soHopDongTD,
          element.tenKhachHang,
          element.cccdKhachHang,
          element.phoneKhachHang,
          element.soTheThanhVienKhachHang,
          element.namSinhKhachHang,
          element.loaiVay,
          element.muchDichVay,
          element.pavvRequest?.reLoanSequence,
          ...(element.taiSanArray ?? []).flatMap((ts: any) => [
            ts.soHopDongTheChapQSDD,
            ts.dungTenBiaDo1,
            ts.dungTenBiaDo2,
            ts.cccdDungTenBiaDo1,
            ts.cccdDungTenBiaDo2,
          ])
        ];

        const combined = searchableFields.map(normalize).join(' ');
        return combined.includes(normalize(filter));
      };
    });
  }

  // Áp dụng filter khi gõ vào ô search
  applyFilter(): void {
    this.dataSource.filter = this.searchKeyword.trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Xóa từ khóa tìm kiếm
  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilter();
  }

  deleteCreditContract(element: CreditContract): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc chắn muốn xóa hợp đồng của ${element.tenKhachHang} (Số HĐTD: ${element.soHopDongTD})? Hành động này không thể hoàn tác.`,
        color: 'red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.creditContractService.deleteCreditContract(element.id!).subscribe({
        next: () => {
          this.removeFromList(element.id!);
          this.notify('Xóa hợp đồng thành công');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // Đã bị xóa từ trước (tab khác, người khác...) -> gỡ khỏi bảng
            this.removeFromList(element.id!);
            this.notify('Hợp đồng không còn tồn tại');
          } else if (err.status === 403) {
            this.notify('Bạn không có quyền xóa hợp đồng này');
          } else {
            this.notify('Xóa thất bại, vui lòng thử lại');
          }
        }
      });
    });
  }

  private removeFromList(id: number): void {
    this.listCreditContract = this.listCreditContract.filter(item => item.id !== id);
    this.dataSource.data = this.listCreditContract; // filter và paginator giữ nguyên
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Đóng', {duration: 3000});
  }
}
