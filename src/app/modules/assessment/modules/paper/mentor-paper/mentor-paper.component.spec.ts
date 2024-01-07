import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPaperComponent } from './mentor-paper.component';

describe('MentorPaperComponent', () => {
  let component: MentorPaperComponent;
  let fixture: ComponentFixture<MentorPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
