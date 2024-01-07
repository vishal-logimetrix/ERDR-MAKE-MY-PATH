import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePathquestionsComponent } from './create-pathquestions.component';

describe('CreatePathquestionsComponent', () => {
  let component: CreatePathquestionsComponent;
  let fixture: ComponentFixture<CreatePathquestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePathquestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePathquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
