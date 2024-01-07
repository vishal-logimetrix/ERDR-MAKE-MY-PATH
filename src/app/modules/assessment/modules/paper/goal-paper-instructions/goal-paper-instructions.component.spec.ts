import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalPaperInstructionsComponent } from './goal-paper-instructions.component';

describe('GoalPaperInstructionsComponent', () => {
  let component: GoalPaperInstructionsComponent;
  let fixture: ComponentFixture<GoalPaperInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalPaperInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalPaperInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
