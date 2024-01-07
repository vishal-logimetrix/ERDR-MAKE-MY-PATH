import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamBooksComponent } from './exam-books.component';

describe('ExamBooksComponent', () => {
  let component: ExamBooksComponent;
  let fixture: ComponentFixture<ExamBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
