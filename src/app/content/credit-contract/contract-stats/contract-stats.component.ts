import { Component } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserStat} from "../../../model/UserStat";
import {ContractStatsService} from "../../../service/contract-stats.service";

@Component({
  selector: 'app-contract-stats',
  templateUrl: './contract-stats.component.html',
  styleUrls: ['./contract-stats.component.css']
})
export class ContractStatsComponent {
  mode: 'month' | 'year' = 'month';
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  months = Array.from({ length: 12 }, (_, i) => i + 1);

  displayedColumns = ['username', 'created', 'updatedContracts', 'updateActions', 'deleted'];
  dataSource = new MatTableDataSource<UserStat>([]);
  loading = false;
  errorMessage = '';

  constructor(private statsService: ContractStatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.errorMessage = '';
    const month = this.mode === 'month' ? this.month : undefined;
    this.statsService.getStats(this.year, month).subscribe({
      next: rows => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Không tải được dữ liệu thống kê';
        this.loading = false;
      }
    });
  }

  total(field: keyof Omit<UserStat, 'userId' | 'username'>): number {
    return this.dataSource.data.reduce((sum, r) => sum + r[field], 0);
  }
}
