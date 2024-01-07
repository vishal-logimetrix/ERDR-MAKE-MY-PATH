import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelfAssessQuesComponent } from './view-self-assess-ques.component';

describe('ViewSelfAssessQuesComponent', () => {
  let component: ViewSelfAssessQuesComponent;
  let fixture: ComponentFixture<ViewSelfAssessQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSelfAssessQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelfAssessQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
