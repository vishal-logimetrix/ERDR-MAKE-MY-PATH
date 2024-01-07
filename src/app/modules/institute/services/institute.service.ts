import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { InstituteConstantsService } from './institute-constants.service';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(
    private networkRequest: NetworkRequestService,
    private consts: InstituteConstantsService,
    private http: HttpClient,
  ) { }

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

  getInstitutePackageMock(id, order) {
    return this.http.get(`${this.consts.packageMockTestSelfQuesApiUrl}/${id}/${order}/`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getPackageAssessmentQuestionReport(assignedId, quesId) {
    return this.http.get(`${this.consts.packageAssessmentQuestionCheckApiUrl}/${assignedId}/${quesId}/`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getPackageAssessmentStudentReport(id, username) {
    return this.http.get(`${this.consts.packageAssessmentStudentReportApiUrl}/${id}/${username}`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getPackageAssessmentTestSelf(id) {
    return this.http.get(`${this.consts.packageAssessmentTestSelfApiUrl}/${id}/`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getPackageAssessmentTestQuesWise(id) {
    return this.http.get(`${this.consts.packageAssessmentTestSelfQuesApiUrl}/${id}/`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  getStudentsList() {
    return this.http.get(this.consts.studentsListApiUrl, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  createStudent(data: any) {
    return this.http.post(this.consts.createStudentApiUrl, data)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  bulkUploadStudents(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    };
    return this.http.post(this.consts.uploadStudentApiUrl, data, httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  searchStudent(username: any) {
    return this.http.get(`${this.consts.studentsListApiUrl}?username=${username}`, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  bulkPackageUpdateStudents(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    };
    return this.http.put(this.consts.updateBulkStudentPackageApiUrl, data, httpOptions)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  addStandard(data: any) {
    return this.http.post(this.consts.addStandardApiUrl, data)
      .pipe(map(res => res),
        catchError(this.handleError));
  }

  addSubject(data: any) {
    return this.http.post(this.consts.addSubjectApiUrl, data)
      .pipe(map(res => res),
        catchError(this.handleError));
  }






  

}
