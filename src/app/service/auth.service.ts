import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient} from "@angular/common/http";
import {SignUpForm} from "../model/SignUpForm";
import {Observable} from "rxjs";
import {SignInForm} from "../model/SignInForm";
import {JwtResponse} from "../model/JwtResponse";
import {ChangeAvatar} from "../model/ChangeAvatar";
import {UpdateProfile} from "../model/UpdateProfile";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_SIGNUP = environment.API + 'auth/signup';
  private API_SIGNIN = environment.API + 'auth/signin';
  private API_UPDATE_AVATAR = environment.API+'auth/change-avatar';
  private API_CHANGE_PASS = environment.API+'auth/change-password';
  private API_UPDATE_PROFILE = environment.API+'auth/update-profile';

  constructor(private httpClient: HttpClient) {
  }

  signUp(signUpForm: SignUpForm): Observable<any> {
    console.log('goi service --->', signUpForm)
    return this.httpClient.post<any>(this.API_SIGNUP, signUpForm);
  }

  signIn(signInForm: SignInForm): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(this.API_SIGNIN, signInForm)
  }

  // ĐỔI: nhận File, gửi multipart/form-data thay vì JSON
  editAvatar(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('file', file); // tên 'file' phải trùng @RequestParam("file") ở backend
    // Không tự set Content-Type, trình duyệt sẽ tự thêm boundary
    return this.httpClient.put<{ avatar: string }>(this.API_UPDATE_AVATAR, formData);
  }

  // MỚI: biến đường dẫn lưu trong DB thành URL hiển thị được
  getAvatarUrl(avatar?: string | null): string {
    if (!avatar) return 'assets/image/avatar/default.png';
    return environment.SERVER_URL + avatar; // avatar dạng "/uploads/avatars/xxx.png"
  }
  checkRegister = false;
  setRegister(status:boolean){
    this.checkRegister =status;
  }
  getRegister(){
    return this.checkRegister;
  }
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.put(this.API_CHANGE_PASS, { oldPassword, newPassword });
  }
  updateProfile(updateProfile: UpdateProfile): Observable<any> {
    return this.httpClient.put<any>(this.API_UPDATE_PROFILE, updateProfile);
  }
}
