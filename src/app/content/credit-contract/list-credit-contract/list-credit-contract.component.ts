import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {CreditContract} from "../../../model/CreditContract";
import {CreditContractService} from "../../../service/credit-contract.service";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../../model/Category";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-credit-contract',
  templateUrl: './list-credit-contract.component.html',
  styleUrls: ['./list-credit-contract.component.css']
})
export class ListCreditContractComponent implements OnInit{
  listCreditContract: CreditContract[] = [];
  displayedColumns: string[] = ['id', 'tenKhachHang', 'cccdKhachHang','namSinhKhachHang', 'phoneKhachHang', 'soTheThanhVienKhachHang','update'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  constructor(private creditContractService: CreditContractService,
              private router: Router,) {
  }
  ngOnInit(): void {
    this.creditContractService.getListCreditContract().subscribe(data=>{
      this.listCreditContract = data;
      console.log('listCreditContract', this.listCreditContract);
      this.dataSource = new MatTableDataSource<Category>(this.listCreditContract);
      this.dataSource.paginator = this.paginator;
    })
  }
  goToEdit(element: any) {
    this.router.navigate(['/credit-contract-update', element.id]);
  }
}
