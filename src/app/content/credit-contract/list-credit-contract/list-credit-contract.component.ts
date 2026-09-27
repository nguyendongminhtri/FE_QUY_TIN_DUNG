import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {CreditContract} from "../../../model/CreditContract";
import {CreditContractService} from "../../../service/credit-contract.service";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../../model/Category";
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
  displayedColumns: string[] = ['id', 'tenKhachHang', 'cccdKhachHang', 'namSinhKhachHang', 'phoneKhachHang', 'soTheThanhVienKhachHang', 'loaiVay', 'reLoanSequence', 'update', 'delete'];
  dataSource: any;

  // ✅ BỔ SUNG: biến lưu từ khóa tìm kiếm
  searchKeyword: string = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private creditContractService: CreditContractService,
              private router: Router,
              private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.loadListCreditContract();
  }

  goToEdit(element: any) {
    this.router.navigate(['/credit-contract-update', element.id]);
  }

  loadListCreditContract() {
    this.creditContractService.getListCreditContract().subscribe(data => {
      this.listCreditContract = data;
      console.log('listCreditContract', this.listCreditContract);
      this.dataSource = new MatTableDataSource<Category>(this.listCreditContract);
      this.dataSource.paginator = this.paginator;

      // ✅ BỔ SUNG: gắn filterPredicate custom để search gần đúng nhiều field
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
    })
  }

  // ✅ BỔ SUNG: hàm áp dụng filter khi gõ vào ô search
  applyFilter(): void {
    this.dataSource.filter = this.searchKeyword.trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ✅ BỔ SUNG: hàm xóa từ khóa tìm kiếm
  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilter();
  }

  deleteCreditContract(element: CreditContract): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      data: {message: 'Bạn có chắc chắn muốn xóa mục này?', color: 'red'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creditContractService.deleteCreditContract(element.id!).subscribe({
          next: () => {
            console.log('id -->', element.id);
            this.listCreditContract = this.listCreditContract.filter(item => item.id !== element.id);
            this.dataSource.data = this.listCreditContract;
          },
          error: () => {
            console.log('Delete failed!');
          }
        })
      }
    })
  }
}
