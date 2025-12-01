import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {News} from "../model/News";
import {Product} from "../model/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API_PRODUCT = environment.API + 'product'
  constructor(private http: HttpClient) { }
  createProduct(product: Product): Observable<any> {
    return this.http.post<News>(this.API_PRODUCT, product);
  }
  getListProduct(): Observable<any> {
    return this.http.get<News>(this.API_PRODUCT);
  }
  updateStatus(id: number, isShow: boolean): Observable<any> {
    return this.http.put(`${this.API_PRODUCT}/${id}/status`, { isShow });
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.API_PRODUCT + '/' + id);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<News>(`${this.API_PRODUCT}/${id}`);
  }
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_PRODUCT}/${id}`, data);
  }
  getPageProductByCategoryId(categoryId: number, request: any): Observable<any> {
    return this.http.get(
      `${this.API_PRODUCT}/by-category/${categoryId}`,
      { params: request }
    );
  }
  searchProductByCategory(categoryId: number, request: any): Observable<any> {
    return this.http.get(
      `${this.API_PRODUCT}/by-category/${categoryId}/search`,
      { params: request }
    );
  }
}
