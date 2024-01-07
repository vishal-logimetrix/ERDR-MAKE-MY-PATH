import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../environments/environment';
import { MiscellaneousService } from './miscellaneous.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private misc: MiscellaneousService,
  ) {
  }

  BASE_URL = environment.BASE_URL;    //https://backendprod.makemypath.app

  loginOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  verfiyOptions = {
    'access': this.cookie.get('_l_a_t')
  };


  login(data: any, api: any) {
    return this.http.post(`${this.BASE_URL}${api}`, data, this.loginOptions)   // https://backendprod.makemypath.app/ api/users/login/
      .pipe(
        catchError(this.misc.handleError)
      );
  }
  register(data: any, api: any) {
    return this.http.post(`${this.BASE_URL}${api}`, data, this.loginOptions)
      .pipe(
        catchError(this.misc.handleError)
      );
  }

  logout() {
    this.clearStorage();
    location.replace('/');
  }

  clearStorage() {
    this.cookie.deleteAll('/');
    this.cookie.deleteAll();
    sessionStorage.clear();
  }
}
