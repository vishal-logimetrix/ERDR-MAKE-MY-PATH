import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMentorPaperReportComponent } from './user-mentor-paper-report.component';

describe('UserMentorPaperReportComponent', () => {
  let component: UserMentorPaperReportComponent;
  let fixture: ComponentFixture<UserMentorPaperReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMentorPaperReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMentorPaperReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
