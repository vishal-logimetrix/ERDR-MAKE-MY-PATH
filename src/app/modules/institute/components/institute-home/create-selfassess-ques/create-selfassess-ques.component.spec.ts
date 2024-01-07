import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelfassessQuesComponent } from './create-selfassess-ques.component';

describe('CreateSelfassessQuesComponent', () => {
  let component: CreateSelfassessQuesComponent;
  let fixture: ComponentFixture<CreateSelfassessQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSelfassessQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSelfassessQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
