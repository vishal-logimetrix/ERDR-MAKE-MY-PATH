import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostqueryQuestionComponent } from './edit-postquery-question.component';

describe('EditPostqueryQuestionComponent', () => {
  let component: EditPostqueryQuestionComponent;
  let fixture: ComponentFixture<EditPostqueryQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostqueryQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostqueryQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
