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
export class ListCreditContractComponent implements OnInit{
  listCreditContract: CreditContract[] = [];
  displayedColumns: string[] = ['id', 'tenKhachHang', 'cccdKhachHang','namSinhKhachHang', 'phoneKhachHang', 'soTheThanhVienKhachHang','loaiVay','update', 'delete'];
  dataSource: any;
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
  loadListCreditContract(){
    this.creditContractService.getListCreditContract().subscribe(data=>{
      this.listCreditContract = data;
      console.log('listCreditContract', this.listCreditContract);
      this.dataSource = new MatTableDataSource<Category>(this.listCreditContract);
      this.dataSource.paginator = this.paginator;
    })
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
