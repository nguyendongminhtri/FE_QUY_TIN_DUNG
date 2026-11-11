import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
const NAME_KEY = 'Name_Key';
const AVATAR_KEY = 'Avatar_Key';
const TOKEN_KEY = 'Token_Key';
const ROLE_KEY = 'Role_Key';
const EMAIL_KEY = 'Email_Key';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private roles?: string[];
  // MỚI: phát thông báo mỗi khi avatar đổi
  private avatarSubject = new BehaviorSubject<string | null>(sessionStorage.getItem(AVATAR_KEY));
  avatar$ = this.avatarSubject.asObservable();
  constructor() { }
  public setName(name: string){
    sessionStorage.removeItem(NAME_KEY);
    sessionStorage.setItem(NAME_KEY, name);
  }
  public getName(): string {
    // @ts-ignore
    return sessionStorage.getItem(NAME_KEY);
  }
  public setEmail(email: string) {
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.setItem(EMAIL_KEY, email);
  }
  public getEmail(): string {
    // @ts-ignore
    return sessionStorage.getItem(EMAIL_KEY);
  }
  public setAvatar(avatar: string | null) {
    if (avatar) {
      sessionStorage.setItem(AVATAR_KEY, avatar);
    } else {
      sessionStorage.removeItem(AVATAR_KEY);
    }
    this.avatarSubject.next(avatar);
  }

  // SỬA: trả null thay vì ép kiểu bằng @ts-ignore
  public getAvatar(): string | null {
    return sessionStorage.getItem(AVATAR_KEY);
  }
  public setToken(token: string){
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string {
    // @ts-ignore
    return sessionStorage.getItem(TOKEN_KEY);
  }
  public setRole(role: string[]){
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.setItem(ROLE_KEY, JSON.stringify(role));
  }
  public getRole(): string[] {
    this.roles = [];
    // @ts-ignore
    if(this.getToken()){
      // @ts-ignore
      JSON.parse(sessionStorage.getItem(ROLE_KEY)).forEach(role =>{
        this.roles?.push(role.authority)
      })
    }
    return this.roles;
  }
  public getAdminRole(): boolean {
    const isAminRole = this.getRole().includes('ADMIN')? true : false;
    return isAminRole;
  }
}
