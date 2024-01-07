import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {
  }


  showAlert(message: object, type: any = '', alertmode: any = '') {

    return new Observable(observer => {
      const alertObj = {
        title: message['title'],
        text: message['text'],
        type: type,
      };

      if (type === 'error') {
        alertObj['confirmButtonColor'] = '#f44336';
      } else if (type === 'success') {
        alertObj['confirmButtonColor'] = '#4caf50';
      } else if (type === 'warning') {
        alertObj['confirmButtonColor'] = '#ff9800';
      } else if (type === 'info') {
        alertObj['confirmButtonColor'] = '#00bcd4';
      }


      if (!alertmode) {
        Swal.fire(alertObj);
        observer.complete();

      } else if (alertmode === 'confirm') {

        alertObj['showCancelButton'] = true;

        Swal.fire(alertObj).then((result) => {
          if (result.value) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        });
      }
    });
  }

  hideAlert() {
    return new Observable(observer => {
      Swal.close()
      observer.complete();
    });
  }
}
