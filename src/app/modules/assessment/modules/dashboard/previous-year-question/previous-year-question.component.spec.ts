import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousYearQuestionComponent } from './previous-year-question.component';

describe('PreviousYearQuestionComponent', () => {
  let component: PreviousYearQuestionComponent;
  let fixture: ComponentFixture<PreviousYearQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousYearQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousYearQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
