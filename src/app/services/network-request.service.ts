import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkRequestService {

  constructor(
    private http: HttpClient,
  ) {
  }

  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(error);
    }

    // return an observable with a user-facing error message
    return throwError({
      error: error.error,
    });
  }


  getWithHeaders(api: any) {
    return this.http.get(`${this.BASE_URL}${api}`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getWithoutHeaders(api: any) {
    return this.http.get(`${this.BASE_URL}${api}`)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  delete(api: any) {
    return this.http.delete(`${this.BASE_URL}${api}`)
      .pipe(map(res => res),
        catchError(this.handleError));
  }


  postWithHeader(data: any, api: any, otherUrl = '') {

    const apiUrl = !otherUrl ? `${this.BASE_URL}${api}` : otherUrl

    return this.http.post(apiUrl, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  postFormData(data: any, api: any, otherUrl = '') {

    const apiUrl = !otherUrl ? `${this.BASE_URL}${api}` : otherUrl

    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    };

    return this.http.post(apiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  putWithHeaders(data: any, api: any, otherUrl = '') {

    const apiUrl = !otherUrl ? `${this.BASE_URL}${api}` : otherUrl

    return this.http.put(apiUrl, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  putWithoutHeaders(data: any, api: any, otherUrl = '') {

    const apiUrl = !otherUrl ? `${this.BASE_URL}${api}` : otherUrl

    return this.http.put(apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }


  // For Sending Files Via Put Request
  putFiles(data: any, api: any, otherUrl = '') {

    const apiUrl = !otherUrl ? `${this.BASE_URL}${api}` : otherUrl

    return this.http.put(apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }
}


/* Use this service for making all Get and Post requests from server using observers */
