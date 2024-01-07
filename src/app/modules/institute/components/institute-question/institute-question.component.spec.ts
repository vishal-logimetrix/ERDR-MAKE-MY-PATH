import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteQuestionComponent } from './institute-question.component';

describe('InstituteQuestionComponent', () => {
  let component: InstituteQuestionComponent;
  let fixture: ComponentFixture<InstituteQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
