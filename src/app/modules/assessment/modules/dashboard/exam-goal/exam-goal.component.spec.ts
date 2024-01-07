import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGoalComponent } from './exam-goal.component';

describe('ExamGoalComponent', () => {
  let component: ExamGoalComponent;
  let fixture: ComponentFixture<ExamGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
