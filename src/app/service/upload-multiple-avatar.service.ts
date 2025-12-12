import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FileMetadataEntity} from "../model/FileMetadataEntity";

@Injectable({
  providedIn: 'root'
})
export class UploadMultipleAvatarService {

  private API_UPLOAD_MULTIPLE_AVATAR = environment.API + 'files/upload';
  constructor(private http: HttpClient) { }
  /**
   * Upload nhiều file lên server
   * @param files danh sách File từ input
   * @returns Observable<string[]> danh sách URL trả về từ backend
   */
  uploadFiles(files: File[]): Observable<FileMetadataEntity[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<FileMetadataEntity[]>(this.API_UPLOAD_MULTIPLE_AVATAR, formData);
  }
}
