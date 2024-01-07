import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMakepathQuestionComponent } from './edit-makepath-question.component';

describe('EditMakepathQuestionComponent', () => {
  let component: EditMakepathQuestionComponent;
  let fixture: ComponentFixture<EditMakepathQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMakepathQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMakepathQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
