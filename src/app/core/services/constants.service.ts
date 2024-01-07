import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() {
  }

  // PAGINATION
  PAGINATION_LIMIT = 10;
  MIDNIGHT = new Date().setHours(0, 0, 0, 0);

}
