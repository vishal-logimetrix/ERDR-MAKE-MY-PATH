import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedQuestionsComponent } from './reported-questions.component';

describe('ReportedQuestionsComponent', () => {
  let component: ReportedQuestionsComponent;
  let fixture: ComponentFixture<ReportedQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
