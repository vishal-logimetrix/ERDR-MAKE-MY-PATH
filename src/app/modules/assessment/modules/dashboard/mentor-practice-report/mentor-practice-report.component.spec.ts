import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPracticeReportComponent } from './mentor-practice-report.component';

describe('MentorPracticeReportComponent', () => {
  let component: MentorPracticeReportComponent;
  let fixture: ComponentFixture<MentorPracticeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPracticeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPracticeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
