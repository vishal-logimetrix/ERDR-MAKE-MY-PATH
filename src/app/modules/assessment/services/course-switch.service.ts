import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseSwitchService {

  private courseId: BehaviorSubject<string> = new BehaviorSubject('');
  private courseSubtype: BehaviorSubject<string> = new BehaviorSubject('');
  private examId: BehaviorSubject<string> = new BehaviorSubject('');
  private examtype: BehaviorSubject<string> = new BehaviorSubject('');
  private fetchedQuestionIds: BehaviorSubject<any> = new BehaviorSubject([]);
  private examResume: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private examPage: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private reloadPage: BehaviorSubject<boolean> = new BehaviorSubject(false);

  courseIdStatus = this.courseId.asObservable();
  courseSubtypeStatus = this.courseSubtype.asObservable();
  examIdStatus = this.examId.asObservable();
  examtypeStatus = this.examtype.asObservable();
  questionIds = this.fetchedQuestionIds.asObservable();
  examResumeStatus = this.examResume.asObservable();
  examPageStatus = this.examPage.asObservable();
  reloadPagetatus = this.reloadPage.asObservable();

  constructor() { }

  updateExamResumeStatus(status) {
    this.examResume.next(status);
  }

  updateExamPageStatus(status) {
    this.examPage.next(status);
  }

  updateReloadPageStatus(status) {
    this.reloadPage.next(status);
  }

  updateCourseId(id) {
    this.courseId.next(id);
  }

  updateCourseSubtype(id) {
    this.courseSubtype.next(id);
  }

  updateExamId(id) {
    this.examId.next(id);
  }

  updateExamType(id) {
    this.examtype.next(id);
  }

  updateQuestionIds(data) {
    this.fetchedQuestionIds.next(data);
  }

}
