import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }



  handleError(error: HttpErrorResponse) {

    const errorObj = {
      statusCode: 0,
      message: ''
    }

    // A client-side or network error occurred. Handle it accordingly.
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error);
    }

    console.log(error)
    // Server Errors
    if (error['error']) {

      // Non Field Error
      if (error['error']['non_field_errors']) {
        console.log(errorObj)
        errorObj.statusCode = error.status
        errorObj.message = error['error']['non_field_errors'][0]
      } else if (error['error']) {
        errorObj.statusCode = error.status
        errorObj.message = error['error']
      }
    }

    return throwError(errorObj);
  };


  getFormErrors(error: object): object {

    const errors = {};
    console.log(error['otp'])

    if (error) {

      // Phone Error
      if (error['contact_number']) {
        errors['contact_number'] = error['contact_number'];
      }

      if (error['head_contact_no']) {
        errors['head_contact_no'] = error['head_contact_no'];
      }

      // Email Error
      if (error['email']) {
        errors['email'] = error['email'];
      }

      // Full Name Error
      if (error['full_name']) {
        errors['full_name'] = error['full_name'];
      }

      // Name Error
      if (error['name']) {
        errors['name'] = error['name'];
      }

      if (error['head']) {
        errors['head'] = error['head'];
      }

      // Otp Error
      if (error['otp']) {
        errors['otp'] = error['otp']
      }

      // Password Error
      if (error['password']) {
        errors['password'] = error['password'][0]
      }

      // Old Password Error
      if (error['old_password']) {
        errors['oldPassword'] = error['old_password']
      }

      return errors;
    }
    return null;
  }
}
