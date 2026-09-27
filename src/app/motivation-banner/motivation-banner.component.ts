import { Component, OnInit } from '@angular/core';

interface Particle {
  style: { [key: string]: string };
}

@Component({
  selector: 'app-motivation-banner',
  templateUrl: './motivation-banner.component.html',
  styleUrls: ['./motivation-banner.component.css']
})
export class MotivationBannerComponent implements OnInit {
  sparkles: Particle[] = [];
  stars: Particle[] = [];

  ngOnInit(): void {
    this.generateParticles();
  }

  private generateParticles(): void {
    // Tạo 25 hạt lấp lánh tròn
    for (let i = 0; i < 25; i++) {
      const size = Math.random() * 4 + 3;
      this.sparkles.push({
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * -20}%`,
          '--mb-travel': `-${460 + 120}px`,
          animationDuration: `${5 + Math.random() * 6}s`,
          animationDelay: `${Math.random() * 6}s`
        }
      });
    }

    // Tạo 20 ngôi sao 4 cánh
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 10 + 14;
      this.stars.push({
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * -20}%`,
          '--mb-travel': `-${460 + 150}px`,
          animationDuration: `${6 + Math.random() * 6}s`,
          animationDelay: `${Math.random() * 6}s`
        }
      });
    }
  }
}
