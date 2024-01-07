import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoalReportComponent } from './pre-goal-report.component';

describe('PreGoalReportComponent', () => {
  let component: PreGoalReportComponent;
  let fixture: ComponentFixture<PreGoalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
