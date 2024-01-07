import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionsStatusReportComponent } from './user-questions-status-report.component';

describe('UserQuestionsStatusReportComponent', () => {
  let component: UserQuestionsStatusReportComponent;
  let fixture: ComponentFixture<UserQuestionsStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQuestionsStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuestionsStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
