import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

  constructor() { }

  modalState: Subject<object> = new Subject<object>();

  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  openModal(modal: string, extraData: any = {}) {

    this.modalState.next({
      'state': true,
      'modal': modal,
      'data': extraData
    })
  }


  hideModal() {
    this.modalState.next({
      'state': false,
    })
  }
}
