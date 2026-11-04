import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserManage} from "../model/UserManage";

@Injectable({
  providedIn: 'root'
})
export class UserManageService {

  private API_USERS = environment.API + 'admin/users';

  constructor(private httpClient: HttpClient) {
  }

  getUsers(): Observable<UserManage[]> {
    return this.httpClient.get<UserManage[]>(this.API_USERS);
  }

  setLock(id: number, locked: boolean): Observable<any> {
    return this.httpClient.put<any>(this.API_USERS + '/' + id + '/lock', null, {params: {locked: locked}});
  }

  updateRoles(id: number, roles: string[]): Observable<any> {
    return this.httpClient.put<any>(this.API_USERS + '/' + id + '/roles', {roles: roles});
  }
  getRoles(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.API_USERS + '/roles');
  }
}
