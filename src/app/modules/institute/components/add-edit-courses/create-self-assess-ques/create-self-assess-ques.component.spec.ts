import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelfAssessQuesComponent } from './create-self-assess-ques.component';

describe('CreateSelfAssessQuesComponent', () => {
  let component: CreateSelfAssessQuesComponent;
  let fixture: ComponentFixture<CreateSelfAssessQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSelfAssessQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSelfAssessQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
