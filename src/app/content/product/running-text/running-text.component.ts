import {Component, Input, OnInit} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Category} from "../../../model/Category";
@Component({
  selector: 'app-running-text',
  templateUrl: './running-text.component.html',
  styleUrls: ['./running-text.component.css']
})
export class RunningTextComponent implements OnInit {
  colors: string[] = [
    'rgba(41,1,6,0.68)',   // 🔴 Đỏ
    'rgb(101,156,156)', // 🟠 Cam
    'rgb(0, 255, 0)',   // 🟢 Lục
    'rgb(0, 0, 255)',   // 🔵 Lam
    '#4B0082',          // 🟣 Chàm (Indigo)
    '#8B00FF'           // 🟪 Tím (Violet)
  ];

  backgroundColor: string = this.colors[0];
  isPaused: boolean = false;
  private colorIndex: number = 0;// màu nền mặc định
  listCategories: Category[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getListCategoryService().subscribe(data => {
      this.listCategories = data;
      this.listCategories = this.listCategories.filter(c => c.type === 'product');
    })
    setInterval(() => {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;
      this.backgroundColor = this.colors[this.colorIndex];
    }, 5000); // đổi màu mỗi 2 giây
  }

  pauseText() {
    this.isPaused = true;
  }

  resumeText() {
    this.isPaused = false;
  }
}
