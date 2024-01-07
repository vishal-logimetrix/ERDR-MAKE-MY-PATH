import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPostqueryQuestionsComponent } from './all-postquery-questions.component';

describe('AllPostqueryQuestionsComponent', () => {
  let component: AllPostqueryQuestionsComponent;
  let fixture: ComponentFixture<AllPostqueryQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPostqueryQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPostqueryQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
