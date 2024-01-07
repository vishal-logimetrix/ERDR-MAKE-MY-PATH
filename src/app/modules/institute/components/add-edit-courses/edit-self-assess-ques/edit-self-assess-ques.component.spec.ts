import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelfAssessQuesComponent } from './edit-self-assess-ques.component';

describe('EditSelfAssessQuesComponent', () => {
  let component: EditSelfAssessQuesComponent;
  let fixture: ComponentFixture<EditSelfAssessQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSelfAssessQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelfAssessQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
