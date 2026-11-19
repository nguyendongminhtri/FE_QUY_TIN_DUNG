import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: 'input[appTienInput]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TienInputDirective),
    multi: true
  }]
})
export class TienInputDirective implements ControlValueAccessor {
  private onChange: (v: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(v: number | null): void {
    this.el.nativeElement.value = v == null ? '' : this.dinhDang(v);
  }

  registerOnChange(fn: (v: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.el.nativeElement.disabled = disabled; }

  @HostListener('input')
  khiNhap(): void {
    const input = this.el.nativeElement;
    const viTri = input.selectionStart ?? input.value.length;
    const soChuSoTruocCon = input.value.slice(0, viTri).replace(/\D/g, '').length;

    const chuSo = input.value.replace(/\D/g, '');
    const so = chuSo ? Number(chuSo) : null;
    input.value = so == null ? '' : this.dinhDang(so);

    // giữ con trỏ đúng chỗ sau khi thêm/bớt dấu chấm
    let dem = 0, pos = 0;
    while (pos < input.value.length && dem < soChuSoTruocCon) {
      if (/\d/.test(input.value[pos])) dem++;
      pos++;
    }
    input.setSelectionRange(pos, pos);

    this.onChange(so);
  }

  @HostListener('blur')
  khiRoi(): void { this.onTouched(); }

  private dinhDang(n: number): string {
    return n.toLocaleString('vi-VN');
  }
}
