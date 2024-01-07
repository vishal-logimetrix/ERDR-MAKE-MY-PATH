import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPracticePaperComponent } from './mentor-practice-paper.component';

describe('MentorPracticePaperComponent', () => {
  let component: MentorPracticePaperComponent;
  let fixture: ComponentFixture<MentorPracticePaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPracticePaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPracticePaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
