import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { CategoryService } from "../../../service/category.service";
import { Category } from "../../../model/Category";

@Component({
  selector: 'app-running-text',
  templateUrl: './running-text.component.html',
  styleUrls: ['./running-text.component.css']
})
export class RunningTextComponent implements OnInit {
  colors: string[] = [
    'rgb(89,12,23)',   // 🔴 Đỏ
    'rgb(3,48,48)',    // 🟠 Cam
    'rgb(5,129,5)',    // 🟢 Lục
    'rgb(0, 0, 255)',  // 🔵 Lam
    '#4B0082',         // 🟣 Chàm (Indigo)
    '#1e0235'          // 🟪 Tím (Violet)
  ];

  backgroundColor: string = this.colors[0];
  isPaused: boolean = false;
  private colorIndex: number = 0;
  listCategories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategories = data.filter((c: Category) => c.type === 'product').map((c: Category) => {
        if (c.name?.includes('Cho vay')) c.emoji = '💳';
        else if (c.name?.includes('Gửi tiết kiệm')) c.emoji = '💰';
        else if (c.name?.includes('Chuyển tiền')) c.emoji = '🔄';
        else c.emoji = '⚙️';
        return c;
      });

      this.cdRef.detectChanges();

      // ép Chrome/iOS khởi động animation sau khi DOM có dữ liệu
      setTimeout(() => {
        const el = document.querySelector('.running-text');
        if (el) el.classList.add('start');
      }, 100);
    });

    // Đổi màu nền động
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        this.backgroundColor = this.colors[this.colorIndex];
        this.cdRef.detectChanges();
      }, 5000);
    });
  }

  pauseText() {
    this.isPaused = true;
  }

  resumeText() {
    this.isPaused = false;
  }
}
