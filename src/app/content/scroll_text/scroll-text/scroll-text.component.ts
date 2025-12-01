import {Component, ElementRef, HostListener, Input} from '@angular/core';

@Component({
  selector: 'app-scroll-text',
  templateUrl: './scroll-text.component.html',
  styleUrls: ['./scroll-text.component.css']
})
export class ScrollTextComponent {
  @Input() linesWithEmoji: { emoji: string, text: string, color?: string }[] = [];
  visibleLines: boolean[] = [];


  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top >= 0 && rect.top <= windowHeight) {
      this.visibleLines = this.linesWithEmoji.map(() => true);
    }
  }
}
