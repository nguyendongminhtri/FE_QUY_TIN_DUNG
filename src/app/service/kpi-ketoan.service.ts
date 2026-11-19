import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {KpiDieuChinh, KpiDinhMuc, KpiKeToanResponse, KpiNhanVienChiNhanh} from "../model/KpiKeToanResponse";
import {environment} from "../../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class KpiKetoanService {

  private API_KPI_KETOAN = environment.API + 'kpi/ke-toan';

  constructor(private http: HttpClient) { }

  // 1. Lấy toàn bộ số liệu và định mức KPI kế toán theo kỳ (vd: '2026-10')
  getKeToan(ky: string): Observable<KpiKeToanResponse> {
    const params = new HttpParams().set('ky', ky);
    return this.http.get<KpiKeToanResponse>(this.API_KPI_KETOAN, { params });
  }

  // 2. Lưu cấu hình định mức tháng (dùng POST hoặc PUT tùy controller của bạn)
  luuDinhMuc(body: KpiDinhMuc): Observable<KpiDinhMuc> {
    return this.http.post<KpiDinhMuc>(`${this.API_KPI_KETOAN}/dinh-muc`, body);
  }

  // 3. Thêm điểm cộng/trừ định tính hoặc chuyên môn
  themDieuChinh(body: { ky: string; username: string; nhom: string; diem: number; lyDo: string }): Observable<KpiDieuChinh> {
    return this.http.post<KpiDieuChinh>(`${this.API_KPI_KETOAN}/dieu-chinh`, body);
  }

  // 4. Xóa lần điều chỉnh điểm theo ID
  xoaDieuChinh(id: number): Observable<any> {
    return this.http.delete(`${this.API_KPI_KETOAN}/dieu-chinh/${id}`);
  }

  // 5. (Bổ sung) Lưu phân bổ chi nhánh cho nhân viên (phục vụ bóc tách huy động 01/02)
  luuChiNhanh(username: string, maChiNhanh: string): Observable<any> {
    return this.http.post(`${this.API_KPI_KETOAN}/nhan-vien-chi-nhanh`, { username, maChiNhanh });
  }
  // 6. Danh sách user kế toán kèm chi nhánh đã gán
  getDanhSachKeToan(ky: string): Observable<KpiNhanVienChiNhanh[]> {
    const params = new HttpParams().set('ky', ky);
    return this.http.get<KpiNhanVienChiNhanh[]>(`${this.API_KPI_KETOAN}/nhan-vien-chi-nhanh`, { params });
  }
  // 7. Lưu mục tiêu huy động năm (chỉ ADMIN)
  luuMucTieuNam(body: { nam: number; mucTieuHuyDong: number }): Observable<any> {
    return this.http.post(`${this.API_KPI_KETOAN}/muc-tieu-nam`, body);
  }
}
