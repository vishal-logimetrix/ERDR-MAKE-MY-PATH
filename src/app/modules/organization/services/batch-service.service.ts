import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchServiceService {

  private examId: BehaviorSubject<string> = new BehaviorSubject('');
  private examtype: BehaviorSubject<string> = new BehaviorSubject('');
  private batchId: BehaviorSubject<string> = new BehaviorSubject('');

  examIdStatus = this.examId.asObservable();
  examtypeStatus = this.examtype.asObservable();
  batchIdStatus = this.batchId.asObservable();

  constructor() { }

  updateExamId(id) {
    this.examId.next(id);
  }

  updateBatchId(id) {
    this.batchId.next(id);
  }
}
