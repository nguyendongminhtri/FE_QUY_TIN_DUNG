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
  numberToVietnamese(number: number | string): string {
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

    function docSo(number: number): string {
      if (number === 0) return 'Không';
      let result = '';
      let i = 0;

      while (number > 0) {
        let phan = number % 1000;
        if (phan > 0) {
          let chu = docSo3ChuSo(phan);
          result = chu + ' ' + DonVi[i] + ' ' + result;
        }
        number = Math.floor(number / 1000);
        i++;
      }

      result = result.trim();
      // Viết hoa chữ cái đầu
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    }

    return docSo(number);
  }

}
