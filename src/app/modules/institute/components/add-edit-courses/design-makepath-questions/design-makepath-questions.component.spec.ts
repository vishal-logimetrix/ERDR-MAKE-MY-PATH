import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMakepathQuestionsComponent } from './design-makepath-questions.component';

describe('DesignMakepathQuestionsComponent', () => {
  let component: DesignMakepathQuestionsComponent;
  let fixture: ComponentFixture<DesignMakepathQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignMakepathQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignMakepathQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
