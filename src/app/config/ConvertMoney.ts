import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConvertMoney {
  numberToVietnameseWordsMoney(number: number | string): string {
    number = Number(number);
    if (isNaN(number)) return '';

    const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const DonVi = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

    function docSo3ChuSo(b: number): string {
      let tram = Math.floor(b / 100);
      let chuc = Math.floor((b % 100) / 10);
      let donvi = b % 10;
      let result = '';

      if (tram > 0) {
        result += ChuSo[tram] + ' trăm';
        if (chuc === 0 && donvi > 0) result += ' linh';
      }

      if (chuc > 0) {
        if (chuc === 1) result += ' mười';
        else result += ' ' + ChuSo[chuc] + ' mươi';
      }

      if (donvi > 0) {
        if (chuc > 1 && donvi === 1) result += ' mốt';
        else if (donvi === 5 && chuc > 0) result += ' lăm';
        else result += ' ' + ChuSo[donvi];
      }

      return result.trim();
    }

    function docTien(number: number): string {
      if (number === 0) return 'Không đồng';
      let result = '';
      let i = 0;

      while (number > 0) {
        let phan = number % 1000;
        if (phan > 0) {
          let tien = docSo3ChuSo(phan);
          result = tien + ' ' + DonVi[i] + ' ' + result;
        }
        number = Math.floor(number / 1000);
        i++;
      }

      result = result.trim();
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result + ' đồng chẵn';
    }

    return docTien(number);
  }

  numberToVietnamese(input: number | string): string {
    const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const DonVi = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

    function docSo3ChuSo(b: number): string {
      let tram = Math.floor(b / 100);
      let chuc = Math.floor((b % 100) / 10);
      let donvi = b % 10;
      let result = '';

      if (tram > 0) {
        result += ChuSo[tram] + ' trăm';
        if (chuc === 0 && donvi > 0) result += ' linh';
      }

      if (chuc > 0) {
        if (chuc === 1) result += ' mười';
        else result += ' ' + ChuSo[chuc] + ' mươi';
      }

      if (donvi > 0) {
        if (chuc > 1 && donvi === 1) result += ' mốt';
        else if (donvi === 5 && chuc > 0) result += ' lăm';
        else result += ' ' + ChuSo[donvi];
      }

      return result.trim();
    }

    function docPhanNguyen(num: number): string {
      if (num === 0) return 'không';
      let result = '';
      let i = 0;
      while (num > 0) {
        const phan = num % 1000;
        if (phan > 0) {
          const chu = docSo3ChuSo(phan);
          result = chu + ' ' + DonVi[i] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        i++;
      }
      return result.trim();
    }

    // ---- Xử lý chuỗi gốc ----
    let s = String(input).trim();

    const hasDot = s.includes('.');
    const hasComma = s.includes(',');
    let decimalSeparator: '.' | ',' | null = null;

    if (hasDot && hasComma) {
      // Chuẩn Việt Nam: dấu chấm là nghìn, dấu phẩy là thập phân
      s = s.replace(/\./g, '');
      decimalSeparator = ',';
    } else if (hasDot && !hasComma) {
      decimalSeparator = '.';
    } else if (!hasDot && hasComma) {
      decimalSeparator = ',';
    }

    let nguyenStr = s;
    let thapPhanStr = '';
    if (decimalSeparator) {
      const parts = s.split(decimalSeparator);
      nguyenStr = parts[0] || '0';
      thapPhanStr = parts[1] || '';
    }

    const nguyen = parseInt(nguyenStr || '0', 10);
    let result = docPhanNguyen(isNaN(nguyen) ? 0 : nguyen);
    console.log('s:', s);
    console.log('nguyenStr:', nguyenStr);
    console.log('thapPhanStr:', thapPhanStr);

    // ---- Đọc phần thập phân ----
    if (thapPhanStr && /^\d+$/.test(thapPhanStr)) {
      result += ' phẩy';
      for (const d of thapPhanStr) {
        result += ' ' + ChuSo[parseInt(d, 10)];
      }
    }

    // ---- Viết hoa chữ cái đầu ----
    return result ? result.charAt(0).toUpperCase() + result.slice(1) : '';
  }





}
