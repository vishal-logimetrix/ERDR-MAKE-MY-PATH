import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentResultAnalysisComponent } from './student-result-analysis.component';

describe('StudentResultAnalysisComponent', () => {
  let component: StudentResultAnalysisComponent;
  let fixture: ComponentFixture<StudentResultAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentResultAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentResultAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
