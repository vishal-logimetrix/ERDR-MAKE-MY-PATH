import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoalPaperSolutionComponent } from './pre-goal-paper-solution.component';

describe('PreGoalPaperSolutionComponent', () => {
  let component: PreGoalPaperSolutionComponent;
  let fixture: ComponentFixture<PreGoalPaperSolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoalPaperSolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoalPaperSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
