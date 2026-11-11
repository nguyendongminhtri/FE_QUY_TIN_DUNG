import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreditContract} from "../../../model/CreditContract";
import {CreditContractService} from "../../../service/credit-contract.service";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {DialogDeleteComponent} from "../../../dialog/dialog-delete/dialog-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {TokenService} from "../../../service/token.service";
import {CreditContractListItem} from "../../../model/CreditContractListItem";
import {catchError, debounceTime, of, Subject, switchMap, takeUntil, tap} from "rxjs";



@Component({
  selector: 'app-list-credit-contract',
  templateUrl: './list-credit-contract.component.html',
  styleUrls: ['./list-credit-contract.component.css']
})
export class ListCreditContractComponent implements OnInit {
  dataSource: MatTableDataSource<CreditContractListItem> = new MatTableDataSource<CreditContractListItem>([]);

  // Trạng thái thu gọn / mở rộng bảng
  collapsed = false;
  isAdmin = false;

  // Phân trang và tìm kiếm do server xử lý
  total = 0;
  pageIndex = 0;
  pageSize = 50;
  loading = false;
  searchKeyword: string = '';

  private readonly load$ = new Subject<void>();
  private readonly keyword$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  // Cột luôn hiển thị (chuyển tên cột qua lại giữa các nhóm để tùy chỉnh)
  private readonly alwaysColumns: string[] = [
    'id', 'tenKhachHang', 'cccdKhachHang', 'loaiVay', 'soHopDongTD'
  ];

  // Nhóm cột bị ẩn khi thu gọn
  private readonly collapsibleColumns: string[] = [
    'namSinhKhachHang', 'phoneKhachHang', 'soTheThanhVienKhachHang',
    'reLoanSequence', 'muchDichVay', 'tatToan', 'createdByUsername', 'createdAt'
  ];

  // Cột thao tác luôn nằm cuối
  private readonly actionColumns: string[] = ['update', 'delete'];

  displayedColumns: string[] = [];

  constructor(private creditContractService: CreditContractService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    const roles: any[] = this.tokenService.getRole() || [];
    this.isAdmin = roles.some(r => (r?.authority ?? r) === 'ADMIN');

    this.collapsed = localStorage.getItem('creditContractCollapsed') === 'true';
    this.updateColumns();

    // Mỗi lần load$ phát ra thì gọi API; yêu cầu cũ bị hủy nếu có yêu cầu mới (switchMap)
    this.load$.pipe(
      tap(() => this.loading = true),
      switchMap(() =>
        this.creditContractService
          .searchCreditContracts(this.searchKeyword.trim(), this.pageIndex, this.pageSize)
          .pipe(catchError(() => of(null)))
      ),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.loading = false;
      if (res) {
        this.dataSource.data = res.content;
        this.total = res.totalElements;
      } else {
        this.notify('Không tải được danh sách hợp đồng');
      }
    });

    // Gõ phím: chờ 300ms rồi mới gọi API, và quay về trang đầu
    this.keyword$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pageIndex = 0;
      this.load$.next();
    });

    this.load$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('creditContractCollapsed', String(this.collapsed));
    this.updateColumns();
  }

  private updateColumns(): void {
    const actions = this.isAdmin
      ? this.actionColumns
      : this.actionColumns.filter(c => c !== 'delete'); // không phải ADMIN: bỏ cột xóa
    this.displayedColumns = [
      ...this.alwaysColumns,
      ...(this.collapsed ? [] : this.collapsibleColumns),
      ...actions,
    ];
  }

  goToEdit(element: CreditContractListItem) {
    this.router.navigate(['/credit-contract-update', element.id]);
  }

  // Gọi khi gõ vào ô tìm kiếm
  onKeywordChange(): void {
    this.keyword$.next(this.searchKeyword);
  }

  // Gọi khi đổi trang hoặc đổi số dòng mỗi trang
  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load$.next();
  }

  // Xóa từ khóa tìm kiếm
  clearSearch(): void {
    this.searchKeyword = '';
    this.pageIndex = 0;
    this.load$.next();
  }

  deleteCreditContract(element: CreditContractListItem): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc chắn muốn xóa hợp đồng của ${element.tenKhachHang} (Số HĐTD: ${element.soHopDongTD})? Hành động này không thể hoàn tác.`,
        color: 'red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.creditContractService.deleteCreditContract(element.id).subscribe({
        next: () => {
          this.reloadAfterDelete();
          this.notify('Xóa hợp đồng thành công');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // Đã bị xóa từ trước (tab khác, người khác...) -> tải lại danh sách
            this.reloadAfterDelete();
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

  // Tải lại trang hiện tại; nếu vừa xóa dòng cuối của trang cuối thì lùi về trang trước
  private reloadAfterDelete(): void {
    if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
      this.pageIndex--;
    }
    this.load$.next();
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Đóng', {duration: 3000});
  }
}
