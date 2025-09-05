import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  ngOnInit(): void {
    setInterval(() => {
      const slider = document.querySelector('.row_footer');
      // @ts-ignore
      const firstItem = slider.firstElementChild;
      // @ts-ignore
      slider.appendChild(firstItem);
    }, 2000);
  }

}
