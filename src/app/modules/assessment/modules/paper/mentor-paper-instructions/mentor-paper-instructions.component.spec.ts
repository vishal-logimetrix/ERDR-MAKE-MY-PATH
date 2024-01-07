import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPaperInstructionsComponent } from './mentor-paper-instructions.component';

describe('MentorPaperInstructionsComponent', () => {
  let component: MentorPaperInstructionsComponent;
  let fixture: ComponentFixture<MentorPaperInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPaperInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPaperInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
