import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoalAssessmentComponent } from './pre-goal-assessment.component';

describe('PreGoalAssessmentComponent', () => {
  let component: PreGoalAssessmentComponent;
  let fixture: ComponentFixture<PreGoalAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoalAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
