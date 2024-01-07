import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorsExamsComponent } from './mentors-exams.component';

describe('MentorsExamsComponent', () => {
  let component: MentorsExamsComponent;
  let fixture: ComponentFixture<MentorsExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorsExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorsExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
