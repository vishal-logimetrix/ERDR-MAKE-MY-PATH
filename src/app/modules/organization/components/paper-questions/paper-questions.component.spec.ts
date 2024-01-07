import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperQuestionsComponent } from './paper-questions.component';

describe('PaperQuestionsComponent', () => {
  let component: PaperQuestionsComponent;
  let fixture: ComponentFixture<PaperQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
