import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostqueryQuestionComponent } from './create-postquery-question.component';

describe('CreatePostqueryQuestionComponent', () => {
  let component: CreatePostqueryQuestionComponent;
  let fixture: ComponentFixture<CreatePostqueryQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePostqueryQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostqueryQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
