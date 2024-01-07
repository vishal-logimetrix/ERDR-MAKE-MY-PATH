import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorrectExamQuestionsComponent } from './incorrect-exam-questions.component';

describe('IncorrectExamQuestionsComponent', () => {
  let component: IncorrectExamQuestionsComponent;
  let fixture: ComponentFixture<IncorrectExamQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncorrectExamQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncorrectExamQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
