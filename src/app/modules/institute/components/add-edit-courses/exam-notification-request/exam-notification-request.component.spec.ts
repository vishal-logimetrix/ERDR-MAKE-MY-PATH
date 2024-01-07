import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamNotificationRequestComponent } from './exam-notification-request.component';

describe('ExamNotificationRequestComponent', () => {
  let component: ExamNotificationRequestComponent;
  let fixture: ComponentFixture<ExamNotificationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamNotificationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamNotificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
