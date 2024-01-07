import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeReportComponent } from './practice-report.component';

describe('PracticeReportComponent', () => {
  let component: PracticeReportComponent;
  let fixture: ComponentFixture<PracticeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
