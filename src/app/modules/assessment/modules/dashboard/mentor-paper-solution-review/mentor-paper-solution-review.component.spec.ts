import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPaperSolutionReviewComponent } from './mentor-paper-solution-review.component';

describe('MentorPaperSolutionReviewComponent', () => {
  let component: MentorPaperSolutionReviewComponent;
  let fixture: ComponentFixture<MentorPaperSolutionReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPaperSolutionReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPaperSolutionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
